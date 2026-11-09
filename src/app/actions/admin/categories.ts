'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  image?: string
  isActive?: boolean
}) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
      }
    })
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/admin/categories')
    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    image?: string
    isActive?: boolean
  }
) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data
    })
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/admin/categories')
    if (category.slug) {
      revalidatePath(`/category/${category.slug}`)
    }
    return { success: true, data: category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    const category = await prisma.category.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/admin/categories')
    if (category.slug) {
      revalidatePath(`/category/${category.slug}`)
    }
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
