'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Search, Download, MoreHorizontal, Eye, Trash, CheckCircle2, Package, Clock, XCircle, Truck, ShoppingCart } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { updateOrderStatus, deleteOrder } from '@/app/actions/admin/orders'
import { toast } from 'sonner'
import { OrderStatus } from '@prisma/client'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { OrderDetailsModal } from './order-details-modal'
import { getWhatsAppStatusUrl, ORDER_STATUS_LABELS } from '@/lib/whatsapp'
import { MessageCircle } from 'lucide-react'

interface OrderData {
  id: string
  orderNumber: string
  customer: string
  phone?: string
  source?: string
  province?: string
  area?: string
  deliveryType?: string
  date: string
  products: number
  total: number
  payment: string
  status: string
  shipping: string
}

const statusConfig: Record<string, { bg: string, text: string, border: string, icon: any, label: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'قيد المراجعة' },
  PROCESSING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'مكتمل' },
  CONFIRMED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'مؤكد' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'ملغى' },
}

const statusFilters = [
  { label: 'جميع الطلبات', value: 'all' },
  { label: 'قيد المراجعة', value: 'PENDING' },
  { label: 'جاري التجهيز', value: 'PROCESSING' },
  { label: 'تم الشحن', value: 'SHIPPED' },
  { label: 'مكتمل', value: 'DELIVERED' },
  { label: 'ملغى', value: 'CANCELLED' },
]

export default function OrdersClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'WHATSAPP'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Listen to source param if opened via sidebar
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('source') === 'WHATSAPP') {
        setSourceFilter('WHATSAPP')
      }
    }
  }, [])

  const handleOpenModal = (id: string) => {
    setSelectedOrderId(id)
    setIsModalOpen(true)
  }

  const handleOrderUpdated = (updatedOrder: any) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o))
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      (o.phone && o.phone.includes(search))
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === id)
    const res = await updateOrderStatus(id, status)
    if (res.success) {
      toast.success(`تم تحديث حالة الطلب إلى "${ORDER_STATUS_LABELS[status] || status}"`)
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o))

      // Trigger prompt to notify customer on WhatsApp
      if (targetOrder?.phone) {
        const url = getWhatsAppStatusUrl({
          phone: targetOrder.phone,
          customerName: targetOrder.customer,
          orderNumber: targetOrder.orderNumber,
          status
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
      toast.error(res.error || 'فشل تحديث حالة الطلب')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteOrder(deleteId)
    if (res.success) {
      toast.success('تم حذف الطلب بنجاح')
      setOrders(orders.filter(o => o.id !== deleteId))
      setDeleteId(null)
    } else {
      toast.error(res.error || 'فشل حذف الطلب')
    }
    setIsDeleting(false)
  }

  const exportCSV = () => {
    const headers = ['رقم الطلب', 'العميل', 'التاريخ', 'المنتجات', 'الإجمالي', 'طريقة الدفع', 'الحالة']
    const csvRows = [
      headers.join(','),
      ...filteredOrders.map(o => [
        o.orderNumber,
        `"${o.customer}"`,
        o.date,
        o.products,
        o.total,
        `"${o.payment}"`,
        o.status
      ].join(','))
    ]
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('تم تصدير ملف الطلبات بنجاح')
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إدارة طلبات WhatsApp</h1>
            <span className="inline-flex items-center gap-1.5 bg-[#25D366]/15 text-[#128C7E] text-xs font-black px-3 py-1 rounded-full border border-[#25D366]/30">
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
              </svg>
              طلبات واتساب فقط
            </span>
          </div>
          <p className="text-sm text-[#78716C] mt-1">متابعة وإدارة كافة طلبات الزبائن الواردة عبر WhatsApp وتحديث الحالات مع إرسال إشعارات فورية</p>
        </div>
        <Button 
          onClick={exportCSV} 
          variant="outline"
          className="h-11 px-4 rounded-xl border-[#E8E4DF] bg-white hover:bg-[#FAFAF8] text-[#1C1917] font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#13213c]" />
          تصدير ملف CSV
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#E8E4DF] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#13213c] transition-colors" />
            <input
              placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
              className="w-full h-11 ps-4 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#13213c]/50 focus:bg-white rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#13213c]/15 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === f.value
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'bg-[#FAFAF8] text-[#78716C] hover:bg-[#F5F0EA] hover:text-[#1C1917] border border-[#E8E4DF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Cards View (sm/md screens) */}
        <div className="md:hidden divide-y divide-[#E8E4DF]">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig['PENDING']
            const StatusIcon = status.icon
            return (
              <div key={order.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1C1917] text-xs font-mono bg-[#FAFAF8] px-2.5 py-1 rounded-lg border border-[#E8E4DF]">
                      #{order.orderNumber}
                    </span>
                    {order.source === 'WHATSAPP' && (
                      <span className="inline-flex items-center gap-1 bg-[#25D366]/15 text-[#128C7E] text-[10px] font-black px-2 py-0.5 rounded-full">
                        واتساب
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-[#1C1917] text-sm">{order.customer}</h4>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      {order.phone ? <span dir="ltr" className="font-mono text-stone-600 me-1">{order.phone}</span> : null}
                      {order.province ? `• ${order.province}` : ''}
                      {` • ${order.products} منتج`}
                    </p>
                    <p className="text-[11px] text-[#A8A29E] mt-0.5">{order.date}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-xs text-[#A8A29E] font-bold">الإجمالي</p>
                    <p className="font-black text-[#1C1917] text-base">
                      {order.total.toLocaleString('en-US')}{' '}
                      <span className="text-xs font-normal text-[#78716C]">د.ع</span>
                    </p>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#F0ECE6]">
                  {order.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        let clean = (order.phone || '').replace(/\D/g, '')
                        if (clean.startsWith('07') && clean.length === 11) {
                          clean = '964' + clean.slice(1)
                        }
                        const msg = `السلام عليكم أستاذ ${order.customer} 👋 بخصوص طلبك رقم ${order.orderNumber} من متجر الهدايا:`
                        window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank')
                      }}
                      className="flex-1 h-9 rounded-xl border-[#25D366]/40 hover:bg-emerald-50 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                      </svg>
                      <span>واتساب</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(order.id)}
                    className="flex-1 h-9 rounded-xl border-[#E8E4DF] hover:bg-[#FAFAF8] text-[#1C1917] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#13213c]" />
                    <span>تفاصيل</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#FAFAF8] text-[#A8A29E] hover:text-[#1C1917] border border-[#E8E4DF]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-[#E8E4DF] bg-white p-1.5 text-[#1C1917]">
                      <DropdownMenuLabel className="text-xs font-bold text-[#A8A29E] px-2.5 py-1">تغيير الحالة</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PENDING')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                        قيد المراجعة
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PROCESSING')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                        جاري التجهيز
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'SHIPPED')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                        تم الشحن
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'DELIVERED')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                        مكتمل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="rounded-xl text-xs font-medium cursor-pointer py-2 text-rose-600">
                        إلغاء الطلب
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#E8E4DF]" />
                      <DropdownMenuItem
                        className="rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer py-2"
                        onClick={() => setDeleteId(order.id)}
                      >
                        <Trash className="w-3.5 h-3.5 me-2" />
                        حذف الطلب
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full min-w-[800px]">
            <TableHeader className="bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">رقم الطلب</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">العميل</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">التاريخ</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">الإجمالي</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">الحالة</TableHead>
                <TableHead className="text-center font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig['PENDING']
                const StatusIcon = status.icon
                return (
                  <TableRow key={order.id} className="hover:bg-[#FAFAF8] transition-colors border-b border-[#E8E4DF]/60 last:border-0 group">
                    <TableCell className="px-6 py-4">
                      <span className="font-bold text-[#1C1917] text-xs font-mono bg-[#FAFAF8] px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] group-hover:border-[#13213c]/40 transition-colors">
                        #{order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1C1917] text-sm">{order.customer}</p>
                        {order.source === 'WHATSAPP' && (
                          <span className="inline-flex items-center gap-1 bg-[#25D366]/15 text-[#128C7E] text-[10px] font-black px-2 py-0.5 rounded-full">
                            واتساب
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {order.phone ? <span dir="ltr" className="font-mono text-stone-600 me-1">{order.phone}</span> : null}
                        {order.province ? `• ${order.province}` : ''}
                        {` • ${order.products} منتج`}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-[#78716C] font-medium">
                      {order.date}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-black text-[#1C1917] text-sm">
                        {order.total.toLocaleString('en-US')}{' '}
                        <span className="text-xs font-normal text-[#78716C]">د.ع</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Direct WhatsApp Chat Action */}
                        {order.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              let clean = (order.phone || '').replace(/\D/g, '')
                              if (clean.startsWith('07') && clean.length === 11) {
                                clean = '964' + clean.slice(1)
                              }
                              const msg = `السلام عليكم أستاذ ${order.customer} 👋 بخصوص طلبك رقم ${order.orderNumber} من متجر الهدايا:`
                              window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank')
                            }}
                            className="h-9 px-2.5 rounded-xl border-[#25D366]/40 hover:bg-emerald-50 text-[#128C7E] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            title="فتح محادثة واتساب مع العميل"
                          >
                            <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                            </svg>
                            <span>واتساب</span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(order.id)}
                          className="h-9 px-3 rounded-xl hover:bg-[#F5F0EA] text-[#78716C] hover:text-[#13213c] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#FAFAF8] text-[#A8A29E] hover:text-[#1C1917]">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-[#E8E4DF] bg-white p-1.5 text-[#1C1917]">
                            <DropdownMenuLabel className="text-xs font-bold text-[#A8A29E] px-2.5 py-1">تغيير الحالة</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PENDING')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                              قيد المراجعة
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PROCESSING')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                              جاري التجهيز
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'SHIPPED')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                              تم الشحن
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'DELIVERED')} className="rounded-xl text-xs font-medium cursor-pointer py-2">
                              مكتمل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="rounded-xl text-xs font-medium cursor-pointer py-2 text-rose-600">
                              إلغاء الطلب
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E8E4DF]" />
                            {order.phone && (
                              <DropdownMenuItem
                                onClick={() => {
                                  const url = getWhatsAppStatusUrl({
                                    phone: order.phone,
                                    customerName: order.customer,
                                    orderNumber: order.orderNumber,
                                    status: order.status
                                  })
                                  if (url) window.open(url, '_blank')
                                }}
                                className="rounded-xl text-xs font-bold text-[#128C7E] hover:bg-emerald-50 cursor-pointer py-2 flex items-center gap-2"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                                إشعار بالحالة عبر WhatsApp 📲
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer py-2"
                              onClick={() => setDeleteId(order.id)}
                            >
                              <Trash className="w-3.5 h-3.5 me-2" />
                              حذف الطلب
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E8E4DF]">
                <ShoppingCart className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917] mb-1">لا توجد طلبات مطابقة</h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto">لم نعثر على أي طلب يطابق معايير البحث أو الفلتر المحددة.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId}
        onOrderUpdated={handleOrderUpdated}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="هل أنت متأكد من حذف الطلب؟"
        description="سيتم حذف سجل هذا الطلب وجميع العناصر المرتبطة به نهائياً من النظام."
        confirmText="حذف نهائي"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
