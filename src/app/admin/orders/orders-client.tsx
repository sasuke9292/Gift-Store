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

interface OrderData {
  id: string
  orderNumber: string
  customer: string
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
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      o.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const res = await updateOrderStatus(id, status)
    if (res.success) {
      toast.success('تم تحديث حالة الطلب بنجاح')
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
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
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إدارة الطلبات</h1>
          <p className="text-sm text-[#78716C] mt-1">متابعة وإدارة طلبات الزبائن وتحديث حالات الشحن والدفع</p>
        </div>
        <Button 
          onClick={exportCSV} 
          variant="outline"
          className="h-11 px-4 rounded-xl border-[#E8E4DF] bg-white hover:bg-[#FAFAF8] text-[#1C1917] font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#C9A96E]" />
          تصدير ملف CSV
        </Button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#E8E4DF] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C9A96E] transition-colors" />
            <input
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              className="w-full h-11 ps-4 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
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

        {/* Table */}
        <div className="overflow-x-auto">
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
                      <span className="font-bold text-[#1C1917] text-xs font-mono bg-[#FAFAF8] px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] group-hover:border-[#C9A96E]/40 transition-colors">
                        #{order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-bold text-[#1C1917] text-sm">{order.customer}</p>
                      <p className="text-xs text-[#78716C]">{order.products} منتج • {order.payment}</p>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(order.id)}
                          className="h-9 px-3 rounded-xl hover:bg-[#F5F0EA] text-[#78716C] hover:text-[#C9A96E] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
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
