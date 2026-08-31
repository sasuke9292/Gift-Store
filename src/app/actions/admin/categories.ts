'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: { name: string, slug: string, description?: string, image?: string }) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      }
    })
    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    return { success: true, data: category }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return { success: false, error: error.message }
  }
}

export async function updateCategory(id: string, data: { name?: string, slug?: string, description?: string, image?: string, isActive?: boolean }) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data
    })
    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    return { success: true, data: category }
  } catch (error: any) {
    console.error('Error updating category:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id }
    })
    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }
}
