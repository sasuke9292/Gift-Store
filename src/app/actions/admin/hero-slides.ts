'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface HeroSlideData {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link: string
  tag?: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateHeroSlideInput {
  title: string
  subtitle?: string
  image: string
  link?: string
  tag?: string
  isActive?: boolean
}

export interface UpdateHeroSlideInput {
  title?: string
  subtitle?: string
  image?: string
  link?: string
  tag?: string
  isActive?: boolean
}

const DEFAULT_SLIDES = [
  {
    title: 'عطور ومجوهرات نسائية راقية',
    subtitle: 'أناقة لا مثيل لها لكل مناسبة سعيدة',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000',
    link: '/category/women',
    tag: 'تشكيلة حصرية',
    order: 0,
    isActive: true
  },
  {
    title: 'أطقم وساعات رجالية فاخرة',
    subtitle: 'هدية تعبّر عن التقدير والرقي',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000',
    link: '/category/men',
    tag: 'الأكثر طلباً',
    order: 1,
    isActive: true
  },
  {
    title: 'بوكسات هدايا وتغليف ملكي',
    subtitle: 'أشرطة حريرية، ورود وشوكولاتة فاخرة',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000',
    link: '/category/occasions',
    tag: 'تغليف مجاني',
    order: 2,
    isActive: true
  },
  {
    title: 'مجوهرات وهدايا مخصصة بالاسم',
    subtitle: 'خلّد اسم من تحب بقطعة استثنائية',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    link: '/category/custom',
    tag: 'صُنعت خصيصاً',
    order: 3,
    isActive: true
  }
]

/**
 * Seed initial slides if table is completely empty
 */
async function ensureDefaultSlidesExist() {
  const count = await prisma.heroSlide.count()
  if (count === 0) {
    await prisma.heroSlide.createMany({
      data: DEFAULT_SLIDES
    })
  }
}

/**
 * Get all hero slides for admin management
 */
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const session = await auth()
    if (!session?.user || session.user.role === 'CUSTOMER') {
      return []
    }

    await ensureDefaultSlidesExist()

    const slides = await prisma.heroSlide.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return slides
  } catch (error) {
    console.error('Failed to get hero slides:', error)
    return []
  }
}

/**
 * Get active slides for public storefront
 */
export async function getPublicHeroSlides(): Promise<HeroSlideData[]> {
  try {
    await ensureDefaultSlidesExist()

    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return slides
  } catch (error) {
    console.error('Failed to get public hero slides:', error)
    return []
  }
}

/**
 * Create a new hero slide
 */
export async function createHeroSlide(input: CreateHeroSlideInput) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  if (!input.title?.trim()) {
    return { success: false, error: 'عنوان الشريحة مطلوب' }
  }

  if (!input.image?.trim()) {
    return { success: false, error: 'صورة الشريحة مطلوبة' }
  }

  try {
    // Find highest order to put the new slide at the end
    const lastSlide = await prisma.heroSlide.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    const nextOrder = (lastSlide?.order ?? -1) + 1

    const slide = await prisma.heroSlide.create({
      data: {
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || null,
        image: input.image.trim(),
        link: input.link?.trim() || '/shop',
        tag: input.tag?.trim() || 'مميز',
        isActive: input.isActive ?? true,
        order: nextOrder
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/hero-slides')
    return { success: true, slide }
  } catch (error: any) {
    console.error('Failed to create hero slide:', error)
    return { success: false, error: error?.message || 'فشل في إنشاء الشريحة' }
  }
}

/**
 * Update an existing hero slide
 */
export async function updateHeroSlide(id: string, input: UpdateHeroSlideInput) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  if (!id) {
    return { success: false, error: 'معرّف الشريحة مطلوب' }
  }

  try {
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.subtitle !== undefined ? { subtitle: input.subtitle?.trim() || null } : {}),
        ...(input.image !== undefined ? { image: input.image.trim() } : {}),
        ...(input.link !== undefined ? { link: input.link?.trim() || '/shop' } : {}),
        ...(input.tag !== undefined ? { tag: input.tag?.trim() || 'مميز' } : {}),
        ...(input.isActive !== undefined ? { isActive: Boolean(input.isActive) } : {})
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/hero-slides')
    return { success: true, slide }
  } catch (error: any) {
    console.error('Failed to update hero slide:', error)
    return { success: false, error: error?.message || 'فشل في تحديث الشريحة' }
  }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    await prisma.heroSlide.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/admin/hero-slides')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete hero slide:', error)
    return { success: false, error: error?.message || 'فشل في حذف الشريحة' }
  }
}

/**
 * Toggle active status of a slide with 1 click
 */
export async function toggleHeroSlideStatus(id: string, isActive: boolean) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: { isActive }
    })

    revalidatePath('/')
    revalidatePath('/admin/hero-slides')
    return { success: true, slide }
  } catch (error: any) {
    console.error('Failed to toggle slide status:', error)
    return { success: false, error: error?.message || 'فشل في تغيير حالة الشريحة' }
  }
}

/**
 * Batch reorder slides
 */
export async function reorderHeroSlides(orderedIds: string[]) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.heroSlide.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    revalidatePath('/')
    revalidatePath('/admin/hero-slides')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to reorder hero slides:', error)
    return { success: false, error: error?.message || 'فشل في حفظ ترتيب الشرائح' }
  }
}
