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
  Calendar, CreditCard
} from 'lucide-react'
import { getOrderDetails, updateOrderStatus, updatePaymentStatus, updateOrderTracking } from '@/app/actions/admin/orders'
import { toast } from 'sonner'
import { OrderStatus, PaymentStatus } from '@prisma/client'

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
      toast.success('تم تحديث حالة الطلب بنجاح')
      setOrder({ ...order, status: value })
      onOrderUpdated({ ...order, status: value })
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
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
            <p className="text-sm font-bold text-[#78716C]">جاري تحميل تفاصيل الطلب...</p>
          </div>
        ) : order ? (
          <div>
            {/* Header */}
            <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                      <StatusIcon className="w-4 h-4" />
                      {currentStatus.label}
                    </span>
                  )
                })()}
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
                      <div>
                        <p className="text-xs text-[#A8A29E] font-bold uppercase mb-1">اسم العميل</p>
                        <p className="text-sm font-bold text-[#1C1917]">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#A8A29E] font-bold uppercase mb-1">رقم الهاتف</p>
                        <p className="text-sm font-bold text-[#1C1917]" dir="ltr">{order.customerPhone}</p>
                      </div>
                      {order.customerEmail && (
                        <div>
                          <p className="text-xs text-[#A8A29E] font-bold uppercase mb-1">البريد الإلكتروني</p>
                          <p className="text-sm font-bold text-[#1C1917] font-mono" dir="ltr">{order.customerEmail}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-[#A8A29E] font-bold uppercase mb-1">عنوان التوصيل</p>
                        <p className="text-sm font-medium text-[#1C1917]">
                          {order.shippingAddress 
                            ? `${order.shippingAddress.governorate || ''}، ${order.shippingAddress.city || ''}، ${order.shippingAddress.street || ''}`
                            : 'العنوان غير محدد'}
                        </p>
                      </div>
                      {order.notes && (
                        <div className="sm:col-span-2 bg-[#FAFAF8] p-3 rounded-xl border border-[#E8E4DF]">
                          <p className="text-xs font-bold text-[#78716C] mb-1">ملاحظات العميل مع الطلب:</p>
                          <p className="text-xs text-[#1C1917]">{order.notes}</p>
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
