'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export interface WhatsAppOrderItemInput {
  id: string
  quantity: number
}

export interface WhatsAppOrderInput {
  customerName: string
  customerPhone: string
  province: string
  area: string
  address: string
  deliveryType?: 'DELIVERY' | 'PICKUP'
  notes?: string
  items: WhatsAppOrderItemInput[]
}

function cleanWhatsAppNumber(rawNumber?: string | null): string {
  if (!rawNumber) return '9647700000000'
  // Remove spaces, dashes, parentheses, and leading plus sign
  let cleaned = rawNumber.replace(/\D/g, '')
  // If number starts with 07 (Iraqi domestic format e.g. 07701234567), replace leading 0 with 964
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    cleaned = '964' + cleaned.slice(1)
  }
  return cleaned || '9647700000000'
}

function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomSuffix = Math.floor(100 + Math.random() * 900) // 3-digit random
  return `ORD-${year}${month}${day}-${randomSuffix}`
}

export async function createWhatsAppOrderAction(data: WhatsAppOrderInput) {
  try {
    // 1. Validate customer inputs
    const name = data.customerName?.trim() || 'زبون المتجر'
    const phone = data.customerPhone?.trim()
    const province = data.province?.trim() || 'بغداد'
    const area = data.area?.trim() || ''
    const address = data.address?.trim() || area
    const deliveryType = 'DELIVERY'
    const notes = data.notes?.trim() || ''

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { error: 'يرجى إدخال رقم هاتف واتساب صحيح (10 أرقام على الأقل).' }
    }
    if (!province) {
      return { error: 'يرجى اختيار المحافظة.' }
    }
    if (!address && !area) {
      return { error: 'يرجى كتابة العنوان والمنطقة وأقرب نقطة دالة للتوصيل.' }
    }
    if (!data.items || data.items.length === 0) {
      return { error: 'السلة فارغة. يرجى إضافة منتجات قبل إتمام الطلب.' }
    }

    // 2. Fetch Store Settings for WhatsApp and Shipping
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)
    
    // Check if WhatsApp ordering is enabled
    if (settings && settings.whatsappOrderEnabled === false) {
      return { error: 'عذراً، خدمة الطلب عبر WhatsApp معطلة مؤقتاً في المتجر حالياً. يرجى مراجعتنا لاحقاً.' }
    }

    const freeThreshold = settings?.freeShippingThreshold ?? 100000
    const baghdadFee = settings?.shippingCostBaghdad ?? 5000
    const provincesFee = settings?.shippingCostProvinces ?? 7000
    const currency = settings?.currency || 'د.ع'
    const storeWhatsApp = cleanWhatsAppNumber(settings?.whatsappNumber)
    const welcomeMsg = settings?.whatsappWelcomeMsg || 'السلام عليكم 👋\nأرغب بتأكيد هذا الطلب:'
    const footerNote = settings?.whatsappFooterNote || 'أرجو تأكيد الطلب، شكراً ❤️'

    // 3. Security: Fetch TRUE prices and active status from DB to prevent client tampering
    const itemMap = new Map<string, number>()
    data.items.forEach(item => {
      const current = itemMap.get(item.id) || 0
      itemMap.set(item.id, current + Math.max(1, Math.floor(item.quantity)))
    })

    const productIds = Array.from(itemMap.keys())
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        images: true
      }
    })

    if (dbProducts.length !== productIds.length) {
      return {
        error: 'بعض المنتجات في السلة غير متوفرة حالياً أو تم تغيير حالتها. يرجى مراجعة السلة والمحاولة مجدداً.'
      }
    }

    // Calculate subtotal from verified DB prices
    let subtotal = 0
    const verifiedItems = dbProducts.map(product => {
      const quantity = itemMap.get(product.id) || 1
      const price = product.salePrice ?? product.price
      const total = price * quantity
      subtotal += total
      return {
        id: product.id,
        name: product.name,
        quantity,
        price,
        total,
        image: product.images?.[0] || null
      }
    })

    // Calculate shipping fee (Direct Delivery)
    let shippingCost = 0
    if (subtotal >= freeThreshold) {
      shippingCost = 0
    } else {
      const isBaghdad = province.includes('بغداد') || province.toLowerCase().includes('baghdad')
      shippingCost = isBaghdad ? baghdadFee : provincesFee
    }

    const totalAmount = subtotal + shippingCost
    const orderNumber = generateOrderNumber()

    // 4. Record order in PostgreSQL as Guest Order (source: WHATSAPP)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerPhone: phone,
        source: 'WHATSAPP',
        province,
        area: area || address,
        deliveryType: 'DELIVERY',
        status: 'PENDING',
        paymentMethod: 'WHATSAPP',
        paymentStatus: 'UNPAID',
        subtotal,
        shippingCost,
        discount: 0,
        total: totalAmount,
        shippingAddress: {
          province,
          area: area || address,
          address: address || area,
          deliveryType: 'DELIVERY'
        },
        notes: notes || null,
        items: {
          create: verifiedItems.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    // 5. Construct Clean, Simple, Professional WhatsApp Message
    const shippingText = shippingCost === 0 ? 'مجاني 🎁' : `${shippingCost.toLocaleString('en-US')} ${currency}`

    const itemsText = verifiedItems
      .map(
        item =>
          `🎁 ${item.name}\nالكمية: ${item.quantity}\nالسعر: ${(item.price * item.quantity).toLocaleString('en-US')} ${currency}`
      )
      .join('\n\n')

    const destinationText = area && address && area !== address ? `${province} - ${area} (${address})` : `${province} - ${address || area}`
    const notesBlock = notes ? `\n📝 ملاحظات أو كارت إهداء:\n${notes}` : ''

    const fullWhatsAppText = `${welcomeMsg}

🧾 رقم الطلب: ${orderNumber}

🛍️ تفاصيل الطلب:
━━━━━━━━━━━━━━
${itemsText}
━━━━━━━━━━━━━━
🚚 التوصيل: ${shippingText}
💰 الإجمالي الكلي: ${totalAmount.toLocaleString('en-US')} ${currency}

📱 رقم المستلم: ${phone}
📍 عنوان التوصيل: ${destinationText}${notesBlock}

${footerNote}`

    const encodedText = encodeURIComponent(fullWhatsAppText)
    const whatsappUrl = `https://wa.me/${storeWhatsApp}?text=${encodedText}`

    return {
      success: true,
      orderNumber,
      orderId: order.id,
      whatsappUrl,
      subtotal,
      shippingCost,
      totalAmount,
      currency
    }
  } catch (error) {
    console.error('WhatsApp order creation error:', error)
    return { error: 'حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.' }
  }
}

// Retain backward-compatible createOrderAction for existing callers
export async function createOrderAction(data: any) {
  return createWhatsAppOrderAction({
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    province: 'بغداد',
    area: 'عام',
    address: data.customerAddress || '',
    deliveryType: 'DELIVERY',
    items: data.items || []
  })
}
