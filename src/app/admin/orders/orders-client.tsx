'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreHorizontal, Eye, Trash, CheckCircle2, Package, Clock, XCircle, Truck, Sparkles, ShoppingCart } from 'lucide-react'
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

const statusConfig: Record<string, { bg: string, text: string, icon: any, label: string }> = {
  PENDING: { bg: 'bg-white/[0.06]', text: 'text-white/50', icon: Clock, label: 'قيد المراجعة' },
  PROCESSING: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2, label: 'مكتمل' },
  CONFIRMED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2, label: 'مؤكد' },
  CANCELLED: { bg: 'bg-rose-500/10', text: 'text-rose-400', icon: XCircle, label: 'ملغى' },
}

const statusFilters = [
  { label: 'الكل', value: 'all' },
  { label: 'قيد المراجعة', value: 'PENDING' },
  { label: 'التجهيز', value: 'PROCESSING' },
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
    const matchesSearch = o.orderNumber.includes(search) || o.customer.includes(search)
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(id, newStatus)
    if (res.success) {
      toast.success('تم تحديث حالة الطلب بنجاح')
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteOrder(deleteId)
    if (res.success) {
      toast.success('تم حذف الطلب بنجاح')
      setOrders(orders.filter(o => o.id !== deleteId))
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">إدارة الطلبات</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">متابعة وتحديث حالة طلبات متجرك.</p>
        </div>
        <Button className="bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white rounded-xl h-9 px-4 font-bold transition-all border border-white/[0.08] text-sm">
          <Download className="w-4 h-4 me-1.5 text-amber-400" />
          تصدير
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-[#0A1628] rounded-2xl border border-white/[0.05] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.05] space-y-3">
          <div className="relative w-full md:max-w-sm group">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-amber-500 transition-colors" />
            <input
              placeholder="ابحث برقم الطلب أو العميل..."
              className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] focus:border-amber-500/50 rounded-xl text-sm text-white/70 placeholder:text-white/25 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  statusFilter === f.value
                    ? 'bg-amber-500 text-[#030810] border-amber-600'
                    : 'bg-white/[0.04] text-white/40 border-white/[0.07] hover:border-white/[0.15] hover:text-white/70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[860px]">
            <TableHeader className="border-b border-white/[0.05]">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">رقم الطلب</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">العميل</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">التاريخ</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">الإجمالي</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">الحالة</TableHead>
                <TableHead className="text-center font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig['PENDING']
                const StatusIcon = status.icon
                return (
                  <TableRow key={order.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0 group">
                    <TableCell className="px-5 py-3">
                      <span className="font-bold text-white/40 text-xs font-mono bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06] group-hover:text-amber-400 group-hover:border-amber-500/20 transition-colors">
                        <span className="opacity-40">#</span>{order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-amber-400 font-bold shrink-0 text-sm">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white/70 text-xs group-hover:text-white/90 transition-colors block">{order.customer}</span>
                          <span className="text-[10px] text-white/25 mt-0.5 block">{order.products} منتجات</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/35 font-medium text-xs py-3">{order.date}</TableCell>
                    <TableCell className="py-3">
                      <span className="font-bold text-amber-400/90 text-xs">
                        {order.total.toLocaleString('en-US')} <span className="text-[10px] text-white/25">د.ع</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1.5 w-max border text-[11px] ${status.bg} ${status.text} border-current/20`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.status === 'PENDING' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                            className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 font-bold rounded-lg h-7 text-[11px] px-2.5 transition-colors">
                            تجهيز
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 font-bold rounded-lg h-7 text-[11px] px-2.5 transition-colors">
                            شحن
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold rounded-lg h-7 text-[11px] px-2.5 transition-colors">
                            توصيل
                          </button>
                        )}
                        <button
                          className="h-7 w-7 text-white/25 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-amber-500/20"
                          onClick={() => handleOpenModal(order.id)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors focus:outline-none border border-transparent hover:border-white/[0.08]">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#0A1628] p-1.5 text-white">
                            <DropdownMenuLabel className="text-[10px] text-white/30 font-bold px-2 py-1.5 uppercase tracking-widest">خيارات</DropdownMenuLabel>
                            {order.status !== 'CANCELLED' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                className="rounded-lg cursor-pointer py-2 px-2.5 font-bold text-amber-400 hover:bg-amber-500/10 text-xs transition-colors"
                              >
                                <XCircle className="me-2 h-3.5 w-3.5" />
                                إلغاء الطلب
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="my-1 bg-white/[0.06]" />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(order.id)}
                              className="rounded-lg cursor-pointer py-2 px-2.5 font-bold text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                            >
                              <Trash className="me-2 h-3.5 w-3.5" />
                              حذف نهائي
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-52 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center">
                        <Search className="w-6 h-6 text-white/20" />
                      </div>
                      <span className="font-bold text-white/30 text-sm">لا توجد طلبات مطابقة</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الطلب"
        description="هل أنت متأكد من حذف هذا الطلب بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف الطلب"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrderId(null)
        }}
        orderId={selectedOrderId}
        onOrderUpdated={handleOrderUpdated}
      />
    </motion.div>
  )
}
