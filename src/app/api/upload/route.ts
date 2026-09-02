import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم رفع أي ملف' }, { status: 400 })
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

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = file.name.split('.').pop()
    const filename = `${uniqueSuffix}.${ext}`
    
    const path = join(uploadDir, filename)
    
    // Save file
    await writeFile(path, buffer)
    
    // Return the URL
    const fileUrl = `/images/uploads/${filename}`
    
    return NextResponse.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء الرفع' }, { status: 500 })
  }
}
