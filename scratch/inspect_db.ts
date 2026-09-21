import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany()
  console.log('Categories count:', categories.length)
  categories.forEach(c => {
    console.log(`- ${c.name} (${c.slug}): image = ${c.image}`)
  })

  const products = await prisma.product.findMany({ take: 5 })
  console.log('\nSample products count:', products.length)
  products.forEach(p => {
    console.log(`- ${p.name} (price: ${p.price}): images = ${JSON.stringify(p.images)}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
