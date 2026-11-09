import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductClient from './product-client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { category: true }
  }).catch(() => null)

  if (!product) {
    return {
      title: 'المنتج غير موجود',
      description: 'عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.'
    }
  }

  const imageUrl = Array.isArray(product.images) && product.images[0] ? (product.images[0] as string) : '/logo-navy.png'

  return {
    title: `${product.name} | گِفتي بلس`,
    description: product.description || `تسوق ${product.name} من متجر گِفتي بلس مع تغليف يدوي ملكي وتوصيل سريع لكافة المحافظات`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || undefined,
      images: [imageUrl]
    }
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: {
        category: true,
      }
    }).catch(() => null),
    prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)
  ])

  if (!product) {
    notFound()
  }

  const formattedProduct = {
    ...product,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    category: product.category?.name || 'غير محدد'
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: Array.isArray(product.images) ? product.images : [],
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: settings?.currency || "IQD",
      availability: product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXTAUTH_URL || 'https://gift-store-rl7i-three.vercel.app'}/product/${product.id}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClient product={formattedProduct} settings={settings} />
    </>
  )
}
