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
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50 border-0 rounded-3xl" dir="rtl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="font-bold text-slate-500">جاري تحميل تفاصيل الطلب...</p>
          </div>
        ) : order ? (
          <>
            <DialogHeader className="p-6 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-800">
                    طلب #{order.orderNumber}
                  </DialogTitle>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {new Date(order.createdAt).toLocaleString('ar-IQ')}
                  </p>
                </div>
                {(() => {
                  const currentStatus = statusConfig[order.status] || statusConfig['PENDING']
                  const StatusIcon = currentStatus.icon
                  return (
                    <Badge variant="secondary" className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-0 shadow-sm text-sm ${currentStatus.bg} ${currentStatus.text}`}>
                      <StatusIcon className="w-4 h-4" />
                      {currentStatus.label}
                    </Badge>
                  )
                })()}
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Items */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        المنتجات ({order.items.length})
                      </h2>
                    </div>
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="p-4 flex items-start sm:items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm truncate">{item.productName}</h4>
                              {item.customOptions && (
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                  {typeof item.customOptions === 'string' ? item.customOptions : JSON.stringify(item.customOptions)}
                                </p>
                              )}
                            </div>
                            <div className="text-end">
                              <p className="font-bold text-slate-800 text-sm">{item.price.toLocaleString('en-US')} د.ع</p>
                              <p className="text-xs text-slate-500 font-medium">الكمية: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        العميل والتوصيل
                      </h2>
                    </div>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">معلومات التواصل</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                              <User className="w-4 h-4 text-slate-400" />
                              {order.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span dir="ltr">{order.customerPhone}</span>
                            </div>
                            {order.customerEmail && (
                              <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {order.customerEmail}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">عنوان التوصيل</h3>
                          <div className="flex items-start gap-2 text-slate-700 font-medium text-sm">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              {order.shippingAddress ? (
                                <>
                                  <p>{order.shippingAddress.governorate} - {order.shippingAddress.city}</p>
                                  <p>{order.shippingAddress.region}، {order.shippingAddress.street}</p>
                                  {order.shippingAddress.nearestPoint && <p className="text-slate-500 mt-1">أقرب نقطة دالة: {order.shippingAddress.nearestPoint}</p>}
                                </>
                              ) : (
                                <span className="text-slate-400">لا يوجد عنوان</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Left Column: Processing & Summary */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Actions */}
                  <Card className="rounded-2xl border-indigo-100 shadow-sm overflow-hidden bg-indigo-50/30">
                    <div className="p-5 border-b border-indigo-100 bg-white">
                      <h2 className="text-base font-bold text-indigo-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-indigo-600" />
                        معالجة الطلب
                      </h2>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600">تحديث الحالة</label>
                        <Select disabled={isUpdating} value={order.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full bg-white h-10 rounded-xl border-slate-200">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl">
                            <SelectItem value="PENDING">قيد المراجعة</SelectItem>
                            <SelectItem value="CONFIRMED">مؤكد</SelectItem>
                            <SelectItem value="PROCESSING">جاري التجهيز</SelectItem>
                            <SelectItem value="SHIPPED">تم الشحن</SelectItem>
                            <SelectItem value="DELIVERED">مكتمل</SelectItem>
                            <SelectItem value="CANCELLED">ملغى</SelectItem>
                            <SelectItem value="RETURNED">مرتجع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600">الدفع ({paymentMethodMap[order.paymentMethod]})</label>
                        <Select disabled={isUpdating} value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
                          <SelectTrigger className="w-full bg-white h-10 rounded-xl border-slate-200">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent dir="rtl" className="rounded-xl">
                            <SelectItem value="UNPAID">غير مدفوع</SelectItem>
                            <SelectItem value="PAID">مدفوع</SelectItem>
                            <SelectItem value="REFUNDED">مسترد</SelectItem>
                            <SelectItem value="FAILED">فشل الدفع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-3 border-t border-indigo-100/50 space-y-2">
                        <label className="text-xs font-bold text-slate-600">تفاصيل التتبع والملاحظات</label>
                        <Textarea 
                          placeholder="رقم التتبع، اسم المندوب..."
                          className="min-h-[80px] resize-none rounded-xl bg-white border-slate-200 focus:border-indigo-500 text-sm"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                        <Button 
                          onClick={handleSaveNotes} 
                          disabled={isUpdating || notes === (order.internalNotes || '')}
                          className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm"
                        >
                          <Save className="w-4 h-4 ms-2" />
                          حفظ التتبع
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financials */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-indigo-600" />
                        الملخص المالي
                      </h2>
                    </div>
                    <CardContent className="p-5">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <span>المجموع الفرعي</span>
                          <span className="font-bold text-slate-800">{order.subtotal.toLocaleString('en-US')} د.ع</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <span>الشحن</span>
                          <span className="font-bold text-slate-800">{order.shippingCost.toLocaleString('en-US')} د.ع</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between items-center text-sm font-medium text-rose-600">
                            <span>الخصم</span>
                            <span className="font-bold">- {order.discount.toLocaleString('en-US')} د.ع</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center mt-2">
                          <span className="font-black text-slate-800">الإجمالي</span>
                          <span className="font-black text-indigo-600 tracking-tight">
                            {order.total.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-500">د.ع</span>
                          </span>
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
