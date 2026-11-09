import { PrismaClient } from '@prisma/client'
import https from 'https'

const prisma = new PrismaClient()

function checkUrl(url: string): Promise<{ url: string; status: number; ok: boolean }> {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      return resolve({ url, status: 200, ok: true })
    }
    const req = https.request(url, { method: 'HEAD', timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode || 0, ok: (res.statusCode || 0) < 400 })
    })
    req.on('error', () => resolve({ url, status: 0, ok: false }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ url, status: 408, ok: false })
    })
    req.end()
  })
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, images: true } })
  const categories = await prisma.category.findMany({ select: { id: true, name: true, image: true } })
  const heroSlides = await prisma.heroSlide.findMany({ select: { id: true, title: true, image: true } })

  console.log(`Auditing ${products.length} products, ${categories.length} categories, ${heroSlides.length} hero slides...`)

  const urlMap = new Map<string, string[]>()

  products.forEach(p => {
    try {
      const raw = p.images
      const imgs = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(imgs)) {
        imgs.forEach((img: string) => {
          if (typeof img === 'string') {
            const list = urlMap.get(img) || []
            list.push(`Product: ${p.name} (${p.id})`)
            urlMap.set(img, list)
          }
        })
      }
    } catch {}
  })

  categories.forEach(c => {
    if (c.image) {
      const list = urlMap.get(c.image) || []
      list.push(`Category: ${c.name} (${c.id})`)
      urlMap.set(c.image, list)
    }
  })

  heroSlides.forEach(h => {
    if (h.image) {
      const list = urlMap.get(h.image) || []
      list.push(`HeroSlide: ${h.title} (${h.id})`)
      urlMap.set(h.image, list)
    }
  })

  console.log(`Found ${urlMap.size} unique URLs to verify. Checking statuses...`)
  const urls = Array.from(urlMap.keys())
  const broken: { url: string; status: number; usedIn: string[] }[] = []

  for (const url of urls) {
    const res = await checkUrl(url)
    if (!res.ok) {
      broken.push({ url, status: res.status, usedIn: urlMap.get(url) || [] })
      console.log(`[BROKEN ${res.status}] ${url}`)
    }
  }

  console.log(`Audit complete: ${broken.length} broken images found out of ${urls.length}.`)
  if (broken.length > 0) {
    console.log(JSON.stringify(broken, null, 2))
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
