'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { 
  Package, Clock, Truck, CheckCircle2, XCircle, 
  User, Phone, Mail, MapPin, Receipt, Save, Loader2
} from 'lucide-react'
import { getOrderDetails, updateOrderStatus, updatePaymentStatus, updateOrderTracking } from '@/app/actions/admin/orders'
import { toast } from 'sonner'
import { OrderStatus, PaymentStatus } from '@prisma/client'

const statusConfig: Record<string, { bg: string, text: string, icon: any, label: string }> = {
  PENDING: { bg: 'bg-slate-100', text: 'text-slate-600', icon: Clock, label: 'قيد المراجعة' },
  CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2, label: 'مؤكد' },
  PROCESSING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2, label: 'مكتمل' },
  CANCELLED: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle, label: 'ملغى' },
  RETURNED: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle, label: 'مرتجع' },
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
    if (isOpen && orderId) {
      fetchOrderDetails()
    } else {
      setOrder(null)
      setNotes('')
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    setIsLoading(true)
    const res = await getOrderDetails(orderId!)
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

  const handleStatusChange = async (value: OrderStatus) => {
    setIsUpdating(true)
    const res = await updateOrderStatus(order.id, value)
    if (res.success) {
      toast.success('تم تحديث حالة الطلب')
      setOrder({ ...order, status: value })
      onOrderUpdated({ ...order, status: value })
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
    setIsUpdating(false)
  }

  const handlePaymentStatusChange = async (value: PaymentStatus) => {
    setIsUpdating(true)
    const res = await updatePaymentStatus(order.id, value)
    if (res.success) {
      toast.success('تم تحديث حالة الدفع')
      setOrder({ ...order, paymentStatus: value })
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
    setIsUpdating(false)
  }

  const handleSaveNotes = async () => {
    setIsUpdating(true)
    const res = await updateOrderTracking(order.id, notes)
    if (res.success) {
      toast.success('تم حفظ الملاحظات وتفاصيل التتبع')
      setOrder({ ...order, internalNotes: notes })
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
    setIsUpdating(false)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl w-[95vw] md:w-full p-0 overflow-hidden bg-[#060D1A] border border-white/[0.05] rounded-3xl shadow-2xl" dir="rtl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            <p className="font-bold text-white/50">جاري تحميل تفاصيل الطلب...</p>
          </div>
        ) : order ? (
          <>
            <DialogHeader className="p-6 border-b border-white/[0.05] bg-[#0A1628]">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-black text-white/90 flex items-center gap-2">
                    <span>طلب</span>
                    <span dir="rtl" className="text-amber-400">#{order.orderNumber}</span>
                  </DialogTitle>
                  <p className="text-white/40 text-sm font-medium mt-1">
                    {new Date(order.createdAt).toLocaleString('ar-IQ')}
                  </p>
                </div>
                {(() => {
                  const currentStatus = statusConfig[order.status] || statusConfig['PENDING']
                  const StatusIcon = currentStatus.icon
                  return (
                    <Badge variant="secondary" className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-0 shadow-sm text-sm ${currentStatus.bg.replace('bg-', 'bg-').replace('-100', '-500/10')} ${currentStatus.text.replace('text-', 'text-').replace('-700', '-400')}`}>
                      <StatusIcon className="w-4 h-4" />
                      {currentStatus.label}
                    </Badge>
                  )
                })()}
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Right Column (First in RTL): Processing & Summary */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Actions */}
                  <Card className="rounded-2xl border-amber-500/20 shadow-sm overflow-hidden bg-amber-500/[0.02]">
                    <div className="p-5 border-b border-amber-500/10 bg-amber-500/5">
                      <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-amber-500" />
                        معالجة الطلب
                      </h2>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50">تحديث الحالة</label>
                        <Select disabled={isUpdating} value={order.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full bg-[#0A1628] h-10 rounded-xl border-white/[0.08] text-white/80 text-start hover:border-amber-500/50 transition-colors focus:ring-amber-500/20">
                            <SelectValue placeholder="اختر الحالة">{statusConfig[order.status]?.label}</SelectValue>
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl bg-[#0A1628] border-white/[0.08]">
                            <SelectItem value="PENDING" className="text-white/80 focus:bg-white/[0.04]">قيد المراجعة</SelectItem>
                            <SelectItem value="CONFIRMED" className="text-white/80 focus:bg-white/[0.04]">مؤكد</SelectItem>
                            <SelectItem value="PROCESSING" className="text-white/80 focus:bg-white/[0.04]">جاري التجهيز</SelectItem>
                            <SelectItem value="SHIPPED" className="text-white/80 focus:bg-white/[0.04]">تم الشحن</SelectItem>
                            <SelectItem value="DELIVERED" className="text-white/80 focus:bg-white/[0.04]">مكتمل</SelectItem>
                            <SelectItem value="CANCELLED" className="text-white/80 focus:bg-white/[0.04]">ملغى</SelectItem>
                            <SelectItem value="RETURNED" className="text-white/80 focus:bg-white/[0.04]">مرتجع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50">حالة الدفع</label>
                        <Select disabled={isUpdating} value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
                          <SelectTrigger className="w-full bg-[#0A1628] h-10 rounded-xl border-white/[0.08] text-white/80 text-start hover:border-amber-500/50 transition-colors focus:ring-amber-500/20">
                            <SelectValue placeholder="اختر الحالة">{paymentStatusMap[order.paymentStatus]}</SelectValue>
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl bg-[#0A1628] border-white/[0.08]">
                            <SelectItem value="UNPAID" className="text-white/80 focus:bg-white/[0.04]">غير مدفوع</SelectItem>
                            <SelectItem value="PAID" className="text-white/80 focus:bg-white/[0.04]">مدفوع</SelectItem>
                            <SelectItem value="REFUNDED" className="text-white/80 focus:bg-white/[0.04]">مسترد</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-3 border-t border-amber-500/10 space-y-2">
                        <label className="text-xs font-bold text-white/50">تفاصيل التتبع والملاحظات</label>
                        <Textarea 
                          placeholder="رقم التتبع، اسم المندوب..."
                          className="min-h-[80px] resize-none rounded-xl bg-[#0A1628] border-white/[0.08] hover:border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/20 text-sm text-white/80 placeholder:text-white/20 transition-colors"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                        <Button 
                          onClick={handleSaveNotes} 
                          disabled={isUpdating || notes === (order.internalNotes || '')}
                          className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold text-sm shadow-[0_4px_15px_rgba(245,158,11,0.2)] transition-all"
                        >
                          <Save className="w-4 h-4 ms-2" />
                          حفظ التتبع
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financials */}
                  <Card className="rounded-2xl border-white/[0.05] shadow-sm overflow-hidden bg-[#0A1628]">
                    <div className="p-5 border-b border-white/[0.05] bg-white/[0.02]">
                      <h2 className="text-base font-bold text-white/85 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-amber-500" />
                        الملخص المالي
                      </h2>
                    </div>
                    <CardContent className="p-5">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm font-medium text-white/60">
                          <span>المجموع الفرعي</span>
                          <span className="font-bold text-white/90">{order.subtotal.toLocaleString('en-US')} د.ع</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-white/60">
                          <span>الشحن</span>
                          <span className="font-bold text-white/90">{order.shippingCost.toLocaleString('en-US')} د.ع</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between items-center text-sm font-medium text-rose-400">
                            <span>الخصم</span>
                            <span className="font-bold">- {order.discount.toLocaleString('en-US')} د.ع</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center mt-2">
                          <span className="font-black text-white/90">الإجمالي</span>
                          <span className="font-black text-amber-400 tracking-tight">
                            {order.total.toLocaleString('en-US')} <span className="text-xs font-bold text-amber-500/60">د.ع</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>
                
                {/* Left Column (Second in RTL): Details */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Items */}
                  <Card className="rounded-2xl border-white/[0.05] shadow-sm overflow-hidden bg-[#0A1628]">
                    <div className="p-5 border-b border-white/[0.05] bg-white/[0.02]">
                      <h2 className="text-base font-bold text-white/85 flex items-center gap-2">
                        <Package className="w-5 h-5 text-amber-500" />
                        المنتجات ({order.items.length})
                      </h2>
                    </div>
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/[0.05] max-h-64 overflow-y-auto">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="p-4 flex items-start sm:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                            <div className="w-14 h-14 rounded-xl bg-white/[0.02] shrink-0 border border-white/[0.05] overflow-hidden flex items-center justify-center">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-white/20" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white/90 text-sm truncate">{item.productName}</h4>
                              {item.customOptions && (
                                <p className="text-xs text-white/40 mt-1 truncate">
                                  {typeof item.customOptions === 'string' ? item.customOptions : JSON.stringify(item.customOptions)}
                                </p>
                              )}
                            </div>
                            <div className="text-end">
                              <p className="font-bold text-amber-400 text-sm">{item.price.toLocaleString('en-US')} د.ع</p>
                              <p className="text-xs text-white/50 font-medium">الكمية: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer */}
                  <Card className="rounded-2xl border-white/[0.05] shadow-sm overflow-hidden bg-[#0A1628]">
                    <div className="p-5 border-b border-white/[0.05] bg-white/[0.02]">
                      <h2 className="text-base font-bold text-white/85 flex items-center gap-2">
                        <User className="w-5 h-5 text-amber-500" />
                        العميل والتوصيل
                      </h2>
                    </div>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">معلومات التواصل</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                              <User className="w-4 h-4 text-amber-500/60" />
                              {order.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                              <Phone className="w-4 h-4 text-amber-500/60" />
                              <span dir="rtl">{order.customerPhone}</span>
                            </div>
                            {order.customerEmail && (
                              <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                                <Mail className="w-4 h-4 text-amber-500/60" />
                                {order.customerEmail}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">عنوان التوصيل</h3>
                          <div className="flex items-start gap-2 text-white/70 font-medium text-sm">
                            <MapPin className="w-4 h-4 text-amber-500/60 mt-0.5 shrink-0" />
                            <div>
                              {order.shippingAddress?.address ? (
                                <p className="leading-relaxed">{order.shippingAddress.address}</p>
                              ) : (
                                <span className="text-white/30">لا يوجد عنوان مسجل</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
