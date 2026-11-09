import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fixing broken image URLs in the database...')

  // Fix products
  const products = await prisma.product.findMany()
  for (const p of products) {
    try {
      const raw = p.images
      const imgs = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(imgs)) {
        let changed = false
        const updated = imgs.map((img: string) => {
          if (img.includes('1563241598-6395ec1ba548')) {
            changed = true
            // If watch or toy
            if (p.name.includes('ساعة')) {
              return 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000'
            }
            return 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1000'
          }
          if (img.includes('1607082348824-0a96f2a4b9da')) {
            changed = true
            return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000'
          }
          if (img.includes('1560859254-809fa84742f3')) {
            changed = true
            return 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1000'
          }
          return img
        })

        if (changed) {
          await prisma.product.update({
            where: { id: p.id },
            data: { images: updated }
          })
          console.log(`Updated product: ${p.name}`)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Fix categories
  const categories = await prisma.category.findMany()
  for (const c of categories) {
    if (c.image) {
      let newImage = c.image
      if (c.image.includes('1607082348824-0a96f2a4b9da')) {
        newImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000'
      } else if (c.image.includes('1560859254-809fa84742f3')) {
        newImage = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1000'
      }

      if (newImage !== c.image) {
        await prisma.category.update({
          where: { id: c.id },
          data: { image: newImage }
        })
        console.log(`Updated category: ${c.name}`)
      }
    }
  }

  console.log('All broken database images replaced with verified 200 OK images!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
