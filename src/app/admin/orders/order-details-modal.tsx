'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { 
  Package, Clock, Truck, CheckCircle2, XCircle, 
  User, Phone, Mail, MapPin, Receipt, Save, Loader2,
  Calendar, CreditCard, X
} from 'lucide-react'
import { getOrderDetails, updateOrderStatus, updatePaymentStatus, updateOrderTracking } from '@/app/actions/admin/orders'
import { toast } from 'sonner'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { getWhatsAppStatusUrl, ORDER_STATUS_LABELS } from '@/lib/whatsapp'

const statusConfig: Record<string, { bg: string, text: string, border: string, icon: any, label: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'قيد المراجعة' },
  CONFIRMED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'مؤكد' },
  PROCESSING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'مكتمل' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'ملغى' },
  RETURNED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'مرتجع' },
}

const paymentStatusMap: Record<string, string> = {
  UNPAID: 'غير مدفوع',
  PAID: 'مدفوع',
  REFUNDED: 'مسترد',
  FAILED: 'فشل الدفع'
}

const paymentMethodMap: Record<string, string> = {
  COD: 'الدفع عند الاستلام',
  ONLINE: 'دفع إلكتروني',
  MANUAL: 'تحويل يدوي'
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  onOrderUpdated: (updatedOrder: any) => void
}

export function OrderDetailsModal({ isOpen, onClose, orderId, onOrderUpdated }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let isCancelled = false
    if (!isOpen || !orderId) return

    async function load() {
      setIsLoading(true)
      const res = await getOrderDetails(orderId!)
      if (isCancelled) return
      if (res.success && res.data) {
        let parsedAddress = null
        try {
          if (res.data.shippingAddress) {
            parsedAddress = typeof res.data.shippingAddress === 'string' 
              ? JSON.parse(res.data.shippingAddress) 
              : res.data.shippingAddress
          }
        } catch (e) {
          console.error('Failed to parse shipping address', e)
        }
        
        const formatted = { ...res.data, shippingAddress: parsedAddress }
        setOrder(formatted)
        setNotes(formatted.internalNotes || '')
      } else {
        toast.error(res.error || 'فشل جلب تفاصيل الطلب')
        onClose()
      }
      setIsLoading(false)
    }

    load()
    return () => { isCancelled = true }
  }, [isOpen, orderId, onClose])

  const handleStatusChange = async (value: OrderStatus) => {
    setIsUpdating(true)
    const res = await updateOrderStatus(order.id, value)
    if (res.success) {
      toast.success(`تم تحديث حالة الطلب إلى "${ORDER_STATUS_LABELS[value] || value}"`)
      setOrder({ ...order, status: value })
      onOrderUpdated({ ...order, status: value })

      // Automatically offer sending WhatsApp notification to the customer
      if (order.customerPhone) {
        const url = getWhatsAppStatusUrl({
          phone: order.customerPhone,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          status: value,
          internalNotes: notes || order.internalNotes
        })
        if (url) {
          toast.info('إشعار العميل بالحالة الجديدة', {
            action: {
              label: 'إرسال WhatsApp للعميل 📲',
              onClick: () => window.open(url, '_blank')
            },
            duration: 10000
          })
        }
      }
    } else {
      toast.error(res.error || 'حدث خطأ أثناء التحديث')
    }
    setIsUpdating(false)
  }

  const handlePaymentStatusChange = async (value: PaymentStatus) => {
    setIsUpdating(true)
    const res = await updatePaymentStatus(order.id, value)
    if (res.success) {
      toast.success('تم تحديث حالة الدفع بنجاح')
      setOrder({ ...order, paymentStatus: value })
    } else {
      toast.error(res.error || 'حدث خطأ أثناء التحديث')
    }
    setIsUpdating(false)
  }

  const handleSaveNotes = async () => {
    setIsUpdating(true)
    const res = await updateOrderTracking(order.id, notes)
    if (res.success) {
      toast.success('تم حفظ التتبع والملاحظات')
      setOrder({ ...order, internalNotes: notes })
    } else {
      toast.error(res.error || 'حدث خطأ أثناء الحفظ')
    }
    setIsUpdating(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-4xl p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
            <p className="text-sm font-bold text-[#78716C]">جاري تحميل تفاصيل الطلب...</p>
          </div>
        ) : order ? (
          <div>
            {/* Header */}
            <DialogHeader className="p-5 sm:p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <DialogTitle className="text-xl font-black text-[#1C1917] flex items-center gap-2.5">
                      <span>طلب #{order.orderNumber}</span>
                    </DialogTitle>
                    <p className="text-xs text-[#78716C] mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#A8A29E]" />
                      {new Date(order.createdAt).toLocaleDateString('ar-IQ', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {(() => {
                    const currentStatus = statusConfig[order.status] || statusConfig['PENDING']
                    const StatusIcon = currentStatus.icon
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} shadow-2xs`}>
                        <StatusIcon className="w-4 h-4" />
                        {currentStatus.label}
                      </span>
                    )
                  })()}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 active:scale-90 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                  title="إغلاق النافذة"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Processing & Summary) */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Processing Card */}
                  <Card className="rounded-2xl border-[#E8E4DF] shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-[#E8E4DF] bg-[#FAFAF8]">
                      <h2 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#C9A96E]" />
                        معالجة الطلب
                      </h2>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#78716C]">حالة الطلب</label>
                        <Select disabled={isUpdating} value={order.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full bg-[#FAFAF8] h-10 rounded-xl border-[#E8E4DF] text-[#1C1917] text-start focus:ring-[#C9A96E]/20">
                            <SelectValue placeholder="اختر الحالة">{statusConfig[order.status]?.label}</SelectValue>
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl bg-white border-[#E8E4DF]">
                            <SelectItem value="PENDING">قيد المراجعة</SelectItem>
                            <SelectItem value="CONFIRMED">مؤكد</SelectItem>
                            <SelectItem value="PROCESSING">جاري التجهيز</SelectItem>
                            <SelectItem value="SHIPPED">تم الشحن</SelectItem>
                            <SelectItem value="DELIVERED">مكتمل</SelectItem>
                            <SelectItem value="CANCELLED" className="text-rose-600">ملغى</SelectItem>
                            <SelectItem value="RETURNED" className="text-rose-600">مرتجع</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Send WhatsApp Status Notification Button */}
                        {order.customerPhone && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = getWhatsAppStatusUrl({
                                phone: order.customerPhone,
                                customerName: order.customerName,
                                orderNumber: order.orderNumber,
                                status: order.status,
                                internalNotes: notes || order.internalNotes
                              })
                              if (url) window.open(url, '_blank')
                            }}
                            className="w-full h-9 rounded-xl border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1.5 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                            </svg>
                            <span className="truncate">إشعار العميل عبر واتساب</span>
                          </Button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#78716C]">حالة الدفع</label>
                        <Select disabled={isUpdating} value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
                          <SelectTrigger className="w-full bg-[#FAFAF8] h-10 rounded-xl border-[#E8E4DF] text-[#1C1917] text-start focus:ring-[#C9A96E]/20">
                            <SelectValue placeholder="اختر الحالة">{paymentStatusMap[order.paymentStatus]}</SelectValue>
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl bg-white border-[#E8E4DF]">
                            <SelectItem value="UNPAID">غير مدفوع</SelectItem>
                            <SelectItem value="PAID">مدفوع</SelectItem>
                            <SelectItem value="REFUNDED">مسترد</SelectItem>
                            <SelectItem value="FAILED">فشل الدفع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-3 border-t border-[#E8E4DF] space-y-2">
                        <label className="text-xs font-bold text-[#78716C]">ملاحظات داخلية ورقم التتبع</label>
                        <Textarea 
                          placeholder="رقم تتبع الشحنة، اسم المندوب..."
                          className="min-h-[80px] resize-none rounded-xl bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#C9A96E] text-xs text-[#1C1917] placeholder:text-[#A8A29E]"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                        <Button 
                          onClick={handleSaveNotes} 
                          disabled={isUpdating || notes === (order.internalNotes || '')}
                          className="w-full h-9 rounded-xl font-bold text-white text-xs shadow-sm cursor-pointer"
                          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                        >
                          <Save className="w-3.5 h-3.5 ms-1.5" />
                          حفظ الملاحظات
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financials Card */}
                  <Card className="rounded-2xl border-[#E8E4DF] shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-[#E8E4DF] bg-[#FAFAF8]">
                      <h2 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#C9A96E]" />
                        الملخص المالي
                      </h2>
                    </div>
                    <CardContent className="p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs text-[#78716C]">
                        <span>المجموع الفرعي:</span>
                        <span className="font-bold text-[#1C1917]">{order.subtotal?.toLocaleString('en-US')} د.ع</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-[#78716C]">
                        <span>أجور التوصيل:</span>
                        <span className="font-bold text-[#1C1917]">{order.shippingCost?.toLocaleString('en-US')} د.ع</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                          <span>الخصم:</span>
                          <span>-{order.discount?.toLocaleString('en-US')} د.ع</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-[#E8E4DF] flex justify-between items-center text-sm font-black text-[#1C1917]">
                        <span>الإجمالي النهائي:</span>
                        <span className="text-[#A07850]">{order.total?.toLocaleString('en-US')} د.ع</span>
                      </div>
                      <div className="pt-2 text-xs text-[#78716C] flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#A8A29E]" />
                        <span>طريقة الدفع: <strong>{paymentMethodMap[order.paymentMethod] || order.paymentMethod}</strong></span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Customer Details & Items */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Customer Information Card */}
                  <Card className="rounded-2xl border-[#E8E4DF] shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-[#E8E4DF] bg-[#FAFAF8]">
                      <h2 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                        <User className="w-4 h-4 text-[#C9A96E]" />
                        معلومات العميل والشحن
                      </h2>
                    </div>
                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-[#A8A29E] font-bold">اسم العميل</p>
                        <p className="text-sm font-bold text-[#1C1917]">{order.customerName}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#A8A29E] font-bold">رقم الهاتف والتواصل</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold font-mono text-[#1C1917]" dir="ltr">
                            {order.customerPhone}
                          </span>
                          {order.customerPhone && (
                            <button
                              type="button"
                              onClick={() => {
                                let clean = (order.customerPhone || '').replace(/\D/g, '')
                                if (clean.startsWith('07') && clean.length === 11) {
                                  clean = '964' + clean.slice(1)
                                }
                                const msg = `السلام عليكم أستاذ ${order.customerName} 👋 بخصوص طلبك رقم ${order.orderNumber} من متجر الهدايا:`
                                window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank')
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                              title="محادثة عبر واتساب"
                            >
                              <svg className="w-3 h-3 fill-[#25D366]" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                              </svg>
                              <span>واتساب</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#A8A29E] font-bold">طريقة الاستلام والمصدر</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#1C1917]">
                            توصيل للعنوان 🚚
                          </span>
                          {order.source === 'WHATSAPP' && (
                            <span className="text-[10px] bg-[#25D366]/20 text-[#128C7E] px-2 py-0.5 rounded-full font-black">
                              طلب واتساب
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-xs text-[#A8A29E] font-bold">عنوان التوصيل بالتفصيل</p>
                        <p className="text-sm font-medium text-[#1C1917]">
                          {(() => {
                            const addr = order.shippingAddress?.address || order.shippingAddress?.street
                            const parts = [
                              order.province,
                              order.area,
                              addr && addr !== order.area ? addr : null
                            ].filter(Boolean)
                            return parts.length > 0 ? parts.join('، ') : 'غير محدد'
                          })()}
                        </p>
                      </div>

                      {order.notes && (
                        <div className="sm:col-span-2 bg-[#FAFAF8] p-3 rounded-xl border border-[#E8E4DF]">
                          <p className="text-xs font-bold text-[#78716C] mb-1">ملاحظات العميل مع الطلب:</p>
                          <p className="text-xs text-[#1C1917] whitespace-pre-wrap">{order.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Items Table */}
                  <Card className="rounded-2xl border-[#E8E4DF] shadow-sm overflow-hidden bg-white">
                    <div className="p-4 border-b border-[#E8E4DF] bg-[#FAFAF8]">
                      <h2 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C9A96E]" />
                        المنتجات المطلوبة ({order.items?.length || 0})
                      </h2>
                    </div>
                    <div className="divide-y divide-[#E8E4DF]">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] overflow-hidden shrink-0 flex items-center justify-center">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-[#A8A29E]" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1C1917]">{item.productName}</p>
                              <p className="text-xs text-[#78716C]">
                                الكمية: <strong className="text-[#1C1917]">{item.quantity}</strong> × {item.price?.toLocaleString('en-US')} د.ع
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="text-sm font-black text-[#1C1917]">
                              {(item.quantity * item.price).toLocaleString('en-US')} د.ع
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
