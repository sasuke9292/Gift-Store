import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.updateMany({
    where: { slug: 'kids' },
    data: { image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800' }
  })
  console.log('Category kids image updated!')
}

main().finally(() => prisma.$disconnect())
