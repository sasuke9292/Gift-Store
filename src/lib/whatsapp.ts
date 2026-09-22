/**
 * Helper utilities for WhatsApp formatting and status update notifications
 */

export function cleanIraqiWhatsAppNumber(rawNumber?: string | null): string {
  if (!rawNumber) return ''
  let cleaned = rawNumber.replace(/\D/g, '')
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    cleaned = '964' + cleaned.slice(1)
  }
  return cleaned
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'قيد المراجعة',
  CONFIRMED: 'تم التأكيد',
  PROCESSING: 'جاري التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'مكتمل وتم التسليم',
  CANCELLED: 'ملغى',
  RETURNED: 'مرتجع'
}

export function getWhatsAppStatusMessage(params: {
  customerName: string
  orderNumber: string
  status: string
  internalNotes?: string | null
  storeName?: string
}): string {
  const { customerName, orderNumber, status, internalNotes, storeName = 'متجر الهدايا' } = params

  let statusBody = ''
  switch (status) {
    case 'CONFIRMED':
      statusBody = `يسعدنا إبلاغك بأنه تم تأكيد واستلام طلبك رقم #${orderNumber} بنجاح! 🎁✨\nفريقنا يقوم حالياً بمراجعة التفاصيل للبدء بالتجهيز الفوري.`
      break

    case 'PROCESSING':
      statusBody = `طلبك رقم #${orderNumber} الآن في مرحلة التجهيز والتغليف الملكي الفاخر 🎁🎀\nنحرص على أدق التفاصيل لضمان وصول هديتك بأبهى صورة.`
      break

    case 'SHIPPED':
      statusBody = `بشرى سارة! تم شحن طلبك رقم #${orderNumber} وهو في الطريق إليك الآن 🚚💨\n${
        internalNotes ? `📦 ملاحظات الشحن / رقم التتبع: ${internalNotes}\n` : ''
      }يرجى إبقاء هاتفك متاحاً للتواصل مع مندوب التوصيل.`
      break

    case 'DELIVERED':
      statusBody = `تم تسليم طلبك رقم #${orderNumber} بنجاح 🎉🥳\nنتمنى أن تنال الهدية إعجابكم وتصنع لكم ولأحبابكم لحظات استثنائية ✨\nشكراً لتسوقك معنا ❤️`
      break

    case 'CANCELLED':
      statusBody = `نود إعلامك بأنه تم إلغاء الطلب رقم #${orderNumber}.\nإذا كان لديك أي استفسار أو رغبت في إعادة تفعيل طلبك، يسعدنا تواصلك معنا دائماً 🌸`
      break

    case 'RETURNED':
      statusBody = `نحيطك علماً بأنه تم تسجيل إعادة الشحنة للطلب رقم #${orderNumber}.\nيسعدنا مساعدتك في أي وقت 🌸`
      break

    case 'PENDING':
    default:
      statusBody = `طلبك رقم #${orderNumber} مسجل لدينا وبانتظار بدء التجهيز ⏳\nسنقوم بإشعارك بأي تحديث جديد أولاً بأول.`
      break
  }

  return `السلام عليكم أستاذ ${customerName} 👋

🔔 إشعار تحديث حالة طلبك من ${storeName}:

${statusBody}

━━━━━━━━━━━━━━
🧾 رقم الطلب: #${orderNumber}
📊 الحالة الحالية: ${ORDER_STATUS_LABELS[status] || status}
━━━━━━━━━━━━━━

نسعد دائماً بخدمتكم، شكراً لاختياركم لنا ❤️`
}

export function getWhatsAppStatusUrl(params: {
  phone?: string | null
  customerName: string
  orderNumber: string
  status: string
  internalNotes?: string | null
  storeName?: string
}): string | null {
  if (!params.phone) return null
  const clean = cleanIraqiWhatsAppNumber(params.phone)
  if (!clean) return null
  const text = getWhatsAppStatusMessage(params)
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}
