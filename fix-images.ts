import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const imagesMap: Record<string, string[]> = {
  'ساعة رولكس كلاسيك (نسخة)': [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'
  ],
  'طقم محفظة وحزام جلد طبيعي 100%': [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
  ],
  'باقة ورد أحمر جوري': [
    'https://images.unsplash.com/photo-1563241598-6395ec1ba548?auto=format&fit=crop&q=80&w=800'
  ],
  'عطر ديور سوفاج للرجال': [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'
  ],
  'صندوق شوكولاتة باتشي فاخر': [
    'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800'
  ]
}

const defaultImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
]

async function main() {
  const products = await prisma.product.findMany()
  
  let updated = 0
  for (const product of products) {
    if (!product.images || product.images.length === 0 || product.images[0] === '') {
      const newImages = imagesMap[product.name] || defaultImages
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      })
      updated++
      console.log(`Updated images for product: ${product.name}`)
    }
  }
  
  console.log(`Successfully updated ${updated} products.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
