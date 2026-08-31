import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const validImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1563241598-6395ec1ba548?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800'
]

async function main() {
  const products = await prisma.product.findMany()
  const categories = await prisma.category.findMany()
  
  // Update all products
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const newImage = validImages[i % validImages.length]
    await prisma.product.update({
      where: { id: p.id },
      data: { images: [newImage] }
    })
  }

  // Update all categories
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i]
    const newImage = validImages[(i + 5) % validImages.length]
    await prisma.category.update({
      where: { id: c.id },
      data: { image: newImage }
    })
  }
  
  console.log(`Updated ${products.length} products and ${categories.length} categories with valid images.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
