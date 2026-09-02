'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreHorizontal, Eye, Trash, CheckCircle2, Package, Clock, XCircle, Truck } from 'lucide-react'
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
  PENDING: { bg: 'bg-slate-100', text: 'text-slate-600', icon: Clock, label: 'قيد المراجعة' },
  PROCESSING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Package, label: 'جاري التجهيز' },
  SHIPPED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Truck, label: 'تم الشحن' },
  DELIVERED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2, label: 'مكتمل' },
  CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2, label: 'مؤكد' },
  CANCELLED: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle, label: 'ملغى' },
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
      className="space-y-6 pb-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">إدارة الطلبات</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">متابعة وتحديث حالة الطلبات لمتجرك.</p>
        </div>
        <Button className="bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl h-10 px-5 font-bold shadow-none transition-all text-sm">
          <Download className="w-4 h-4 me-2" />
          تصدير البيانات
        </Button>
      </div>

      {/* Main Content */}
      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl bg-white">
        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="ابحث برقم الطلب أو العميل..."
                className="ps-4 pe-11 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-10 rounded-xl text-sm shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === f.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[850px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start font-bold text-slate-600 py-4 px-6 text-xs uppercase tracking-wider">رقم الطلب</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-4 text-xs uppercase tracking-wider">العميل</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-4 text-xs uppercase tracking-wider">التاريخ</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-4 text-xs uppercase tracking-wider">الإجمالي</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-4 text-xs uppercase tracking-wider">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-4 px-6 text-xs uppercase tracking-wider">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig['PENDING']
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50 last:border-0">
                      <TableCell className="px-6 py-4">
                        <span className="font-black text-slate-800 text-sm font-mono">#{order.orderNumber}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm">{order.customer}</span>
                          <span className="text-xs text-slate-400 font-medium">{order.products} منتجات</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-sm">{order.date}</TableCell>
                      <TableCell className="py-4">
                        <span className="font-black text-indigo-600 text-sm tracking-tight">
                          {order.total.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-400">د.ع</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 w-max border-0 shadow-sm text-xs ${status.bg} ${status.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {order.status === 'PENDING' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                              className="bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-none font-bold rounded-lg h-8 text-xs px-3">
                              تجهيز
                            </Button>
                          )}
                          {order.status === 'PROCESSING' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-none font-bold rounded-lg h-8 text-xs px-3">
                              شحن
                            </Button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none font-bold rounded-lg h-8 text-xs px-3">
                              توصيل
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            onClick={() => handleOpenModal(order.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100 p-1.5">
                              <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5">خيارات</DropdownMenuLabel>
                              {order.status !== 'CANCELLED' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                  className="rounded-lg cursor-pointer py-2 font-bold text-amber-600 hover:bg-amber-50 text-sm"
                                >
                                  <XCircle className="me-2.5 h-3.5 w-3.5" />
                                  إلغاء الطلب
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="my-1 bg-slate-100" />
                              <DropdownMenuItem
                                onClick={() => setDeleteId(order.id)}
                                className="rounded-lg cursor-pointer py-2 font-bold text-rose-600 hover:bg-rose-50 text-sm"
                              >
                                <Trash className="me-2.5 h-3.5 w-3.5" />
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
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Search className="w-7 h-7 text-slate-300" />
                        </div>
                        <span className="text-base font-medium text-slate-500">لا توجد طلبات مطابقة</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
