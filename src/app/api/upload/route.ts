import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'غير مصرح لك برفع الملفات' }, { status: 403 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم رفع أي ملف' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'حجم الملف يتجاوز الحد المسموح (5 ميجابايت)' }, { status: 400 })
    }

    const fileType = file.type?.toLowerCase()
    const safeExt = ALLOWED_MIME_TYPES[fileType]

    if (!safeExt) {
      return NextResponse.json({ success: false, error: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة (JPG, PNG, WEBP, AVIF, GIF)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      console.error('Error creating directory', e)
    }

    // Create unique filename with safe extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `img-${uniqueSuffix}.${safeExt}`
    
    const path = join(uploadDir, filename)
    
    // Save file
    await writeFile(path, buffer)
    
    // Return the public URL
    const fileUrl = `/images/uploads/${filename}`
    
    return NextResponse.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء رفع الصورة' }, { status: 500 })
  }
}
