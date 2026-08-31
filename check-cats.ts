import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log(JSON.stringify(cats.map(c => ({ name: c.name, image: c.image })), null, 2))
}

main().finally(async () => {
  await prisma.$disconnect()
})
