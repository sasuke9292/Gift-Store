import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

// Supported MIME types and fallback extensions
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user (Allow development testing, enforce admin in production)
    let session = null
    try {
      session = await auth()
    } catch (authError) {
      console.warn('NextAuth session check warning:', authError)
    }

    const isDev = process.env.NODE_ENV === 'development'
    const isAuthenticatedAdmin = session?.user && session.user.role !== 'CUSTOMER'

    if (!isAuthenticatedAdmin && !isDev) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك برفع الملفات. يرجى تسجيل الدخول بحساب مسؤول.' },
        { status: 403 }
      )
    }

    // 2. Parse form data
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم استلام أي ملف للرفع' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت). يرجى اختيار صورة أصغر.' },
        { status: 400 }
      )
    }

    // 3. Detect and validate file extension & MIME type
    const fileType = (file.type || '').toLowerCase().trim()
    let safeExt = ALLOWED_MIME_TYPES[fileType]

    // Fallback: Check extension from file.name if MIME type is missing or generic
    if (!safeExt && file.name) {
      const extFromName = file.name.split('.').pop()?.toLowerCase() || ''
      if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg', 'bmp', 'ico'].includes(extFromName)) {
        safeExt = extFromName === 'jpeg' ? 'jpg' : extFromName
      }
    }

    if (!safeExt) {
      return NextResponse.json(
        { success: false, error: 'صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة (JPG, PNG, WEBP, AVIF, GIF)' },
        { status: 400 }
      )
    }

    // 4. Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const effectiveMime = fileType || (safeExt === 'svg' ? 'image/svg+xml' : `image/${safeExt}`)

    // 5. Attempt saving to local filesystem (works on persistent servers / local development)
    try {
      const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const filename = `img-${uniqueSuffix}.${safeExt}`
      const fullFilePath = join(uploadDir, filename)

      await writeFile(fullFilePath, buffer)

      const fileUrl = `/images/uploads/${filename}`
      return NextResponse.json({ success: true, url: fileUrl })
    } catch (fsError: unknown) {
      // 6. Graceful Serverless Fallback (e.g. Vercel read-only filesystem EROFS)
      // When the host filesystem is read-only, encode as Base64 Data URI so the upload NEVER fails!
      const errMessage = fsError instanceof Error ? fsError.message : String(fsError)
      console.warn('Filesystem write not available, using high-res Data URI fallback:', errMessage)

      const base64 = buffer.toString('base64')
      const dataUri = `data:${effectiveMime};base64,${base64}`

      return NextResponse.json({
        success: true,
        url: dataUri,
        isDataUri: true,
      })
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء معالجة الصورة'
    console.error('Upload route unexpected error:', error)
    return NextResponse.json({ success: false, error: `فشل رفع الصورة: ${errorMsg}` }, { status: 500 })
  }
}
