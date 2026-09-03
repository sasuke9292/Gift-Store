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
  PENDING: { bg: 'bg-slate-100/80', text: 'text-slate-600', icon: Clock, label: 'قيد المراجعة' },
  PROCESSING: { bg: 'bg-amber-100/80', text: 'text-amber-700', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-100/80', text: 'text-blue-700', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-100/80', text: 'text-emerald-700', icon: CheckCircle2, label: 'مكتمل' },
  CONFIRMED: { bg: 'bg-emerald-100/80', text: 'text-emerald-700', icon: CheckCircle2, label: 'مؤكد' },
  CANCELLED: { bg: 'bg-rose-100/80', text: 'text-rose-700', icon: XCircle, label: 'ملغى' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">إدارة الطلبات</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">متابعة وتحديث حالة الطلبات لمتجرك.</p>
        </div>
        <Button className="bg-[#050B14] hover:bg-[#0a1526] text-white rounded-xl h-10 px-5 shadow-[0_8px_20px_rgba(5,11,20,0.15)] font-bold transition-all border border-slate-800 text-sm">
          <Download className="w-4 h-4 me-2 text-amber-400" />
          تصدير البيانات
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100/50 bg-slate-50/30 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <Input
                placeholder="ابحث برقم الطلب أو العميل..."
                className="ps-4 pe-10 bg-white border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 h-10 rounded-xl text-sm shadow-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm ${
                  statusFilter === f.value
                    ? 'bg-amber-500 text-white border-amber-600 shadow-[0_5px_15px_rgba(251,191,36,0.25)]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="text-start font-bold text-slate-500 py-4 px-5 text-[11px] uppercase tracking-wider">رقم الطلب</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">العميل</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">التاريخ</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">الإجمالي</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-500 py-4 px-5 text-[11px] uppercase tracking-wider">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig['PENDING']
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100/50 last:border-0 group">
                      <TableCell className="px-5 py-3">
                        <span className="font-bold text-slate-700 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md border border-slate-200/50 group-hover:border-amber-200 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                          <span className="opacity-50">#</span>{order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-600 font-bold shrink-0 text-sm shadow-sm">
                            {order.customer.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-xs group-hover:text-amber-600 transition-colors">{order.customer}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{order.products} منتجات</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs py-3">{order.date}</TableCell>
                      <TableCell className="py-3">
                        <span className="font-bold text-slate-800 text-xs tracking-tight drop-shadow-sm">
                          {order.total.toLocaleString('en-US')} <span className="text-[10px] font-bold text-slate-400">د.ع</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 w-max border-0 shadow-sm text-[11px] ${status.bg} ${status.text}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {order.status === 'PENDING' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                              className="bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-sm font-bold rounded-lg h-8 text-[11px] px-3">
                              تجهيز
                            </Button>
                          )}
                          {order.status === 'PROCESSING' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm font-bold rounded-lg h-8 text-[11px] px-3">
                              شحن
                            </Button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm font-bold rounded-lg h-8 text-[11px] px-3">
                              توصيل
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                            onClick={() => handleOpenModal(order.id)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none border border-transparent hover:border-slate-200">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100 p-1.5">
                              <DropdownMenuLabel className="text-[10px] text-slate-400 font-bold px-2 py-1.5 uppercase tracking-wider">خيارات</DropdownMenuLabel>
                              {order.status !== 'CANCELLED' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                  className="rounded-lg cursor-pointer py-2 px-2.5 font-bold text-amber-600 hover:bg-amber-50 text-xs transition-colors"
                                >
                                  <XCircle className="me-2 h-3.5 w-3.5" />
                                  إلغاء الطلب
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="my-1 bg-slate-100" />
                              <DropdownMenuItem
                                onClick={() => setDeleteId(order.id)}
                                className="rounded-lg cursor-pointer py-2 px-2.5 font-bold text-rose-600 hover:bg-rose-50 text-xs transition-colors"
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
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className="text-lg font-black text-slate-500">لا توجد طلبات مطابقة للبحث</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
