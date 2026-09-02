'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { 
  ArrowRight, Package, Clock, Truck, CheckCircle2, XCircle, 
  User, Phone, Mail, MapPin, Receipt, CreditCard, Save
} from 'lucide-react'
import { updateOrderStatus, updatePaymentStatus, updateOrderTracking } from '@/app/actions/admin/orders'
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

export default function OrderDetailsClient({ initialOrder }: { initialOrder: any }) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState(order.internalNotes || '')

  const currentStatus = statusConfig[order.status] || statusConfig['PENDING']
  const StatusIcon = currentStatus.icon

  const handleStatusChange = async (value: OrderStatus) => {
    setIsUpdating(true)
    const res = await updateOrderStatus(order.id, value)
    if (res.success) {
      toast.success('تم تحديث حالة الطلب')
      setOrder({ ...order, status: value })
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12 max-w-6xl mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                طلب #{order.orderNumber}
              </h1>
              <Badge variant="secondary" className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 border-0 shadow-sm ${currentStatus.bg} ${currentStatus.text}`}>
                <StatusIcon className="w-4 h-4" />
                {currentStatus.label}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {new Date(order.createdAt).toLocaleString('ar-IQ')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items */}
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                المنتجات المطلوبة ({order.items.length})
              </h2>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {order.items.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{item.productName}</h4>
                      {item.customOptions && (
                        <p className="text-xs text-slate-500 mt-1">
                          {typeof item.customOptions === 'string' ? item.customOptions : JSON.stringify(item.customOptions)}
                        </p>
                      )}
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-slate-800">{item.price.toLocaleString('en-US')} د.ع</p>
                      <p className="text-sm text-slate-500 font-medium">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                تفاصيل العميل والشحن
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">معلومات التواصل</h3>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">عنوان التوصيل</h3>
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
                          <span className="text-slate-400">لا يوجد عنوان مسجل</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">ملاحظات العميل</h3>
                    <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-100/50 leading-relaxed">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Processing & Summary */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Actions */}
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-slate-50/50">
            <div className="p-6 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                معالجة الطلب
              </h2>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">حالة الطلب</label>
                <Select disabled={isUpdating} value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full bg-white h-12 rounded-xl border-slate-200">
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
                <label className="text-sm font-bold text-slate-700">حالة الدفع</label>
                <Select disabled={isUpdating} value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
                  <SelectTrigger className="w-full bg-white h-12 rounded-xl border-slate-200">
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

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <label className="text-sm font-bold text-slate-700">ملاحظات الإدارة وتفاصيل التتبع</label>
                <Textarea 
                  placeholder="أضف رقم تتبع شركة الشحن، اسم المندوب، أو أي ملاحظات داخلية..."
                  className="min-h-[100px] resize-none rounded-xl bg-white border-slate-200 focus:border-indigo-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button 
                  onClick={handleSaveNotes} 
                  disabled={isUpdating || notes === (order.internalNotes || '')}
                  className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  <Save className="w-4 h-4 ms-2" />
                  حفظ الملاحظات
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                ملخص الدفع
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-slate-800">{order.subtotal.toLocaleString('en-US')} د.ع</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>تكلفة الشحن</span>
                  <span className="font-bold text-slate-800">{order.shippingCost.toLocaleString('en-US')} د.ع</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-rose-600">
                    <span>الخصم</span>
                    <span className="font-bold">- {order.discount.toLocaleString('en-US')} د.ع</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-black text-slate-800">الإجمالي</span>
                  <span className="font-black text-indigo-600 text-lg tracking-tight">
                    {order.total.toLocaleString('en-US')} <span className="text-sm font-bold text-slate-500">د.ع</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">طريقة الدفع</span>
                  <Badge variant="outline" className="font-bold border-slate-200">
                    {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">حالة الدفع</span>
                  <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className={`font-bold ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : ''}`}>
                    {paymentStatusMap[order.paymentStatus] || order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </motion.div>
  )
}
