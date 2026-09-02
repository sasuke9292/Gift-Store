'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreHorizontal, Eye, Trash, CheckCircle2, ChevronRight, Package, Clock, XCircle, Truck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { updateOrderStatus, deleteOrder } from '@/app/actions/admin/orders'
import { toast } from 'sonner'
import { OrderStatus } from '@prisma/client'

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

export default function OrdersClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')

  const filteredOrders = orders.filter(
    o => o.orderNumber.includes(search) || o.customer.includes(search)
  )

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(id, newStatus)
    if (res.success) {
      toast.success('تم تحديث حالة الطلب بنجاح')
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    } else {
      toast.error(res.error || 'حدث خطأ')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب بشكل نهائي؟')) {
      const res = await deleteOrder(id)
      if (res.success) {
        toast.success('تم الحذف بنجاح')
        setOrders(orders.filter(o => o.id !== id))
      } else {
        toast.error(res.error || 'حدث خطأ')
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إدارة الطلبات</h1>
          <p className="text-slate-500 font-medium">متابعة وتحديث حالة الطلبات لمتجرك بشكل مباشر.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl h-12 px-6 font-bold shadow-none transition-all"
          >
            <Download className="w-5 h-5 ms-2" />
            تصدير البيانات
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              className="ps-4 pe-12 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-14 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm">
            <Filter className="w-5 h-5 ms-2 text-slate-500" />
            تصفية متقدمة
          </Button>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-end font-bold text-slate-600 py-5 px-8">رقم الطلب</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">العميل</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">التاريخ</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">الإجمالي</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-8">إجراءات سريعة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig['PENDING'];
                    const StatusIcon = status.icon;
                    return (
                      <TableRow 
                        key={order.id}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <TableCell className="px-8 py-5">
                          <span className="font-black text-slate-800 text-base">#{order.orderNumber}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-md">{order.customer}</span>
                            <span className="text-xs text-slate-500 font-medium">{order.products} منتجات</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium">{order.date}</TableCell>
                        <TableCell className="py-5">
                          <span className="font-black text-indigo-600 text-lg tracking-tight">
                            {order.total.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-400">د.ع</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 w-max border-0 shadow-sm ${status.bg} ${status.text}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {order.status === 'PENDING' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                className="bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-none font-bold rounded-xl h-9"
                              >
                                تجهيز
                              </Button>
                            )}
                            {order.status === 'PROCESSING' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-none font-bold rounded-xl h-9"
                              >
                                شحن
                              </Button>
                            )}
                            {order.status === 'SHIPPED' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none font-bold rounded-xl h-9"
                              >
                                توصيل
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" title="عرض التفاصيل">
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus:outline-none">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                                <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5 uppercase tracking-wider">خيارات إضافية</DropdownMenuLabel>
                                {order.status !== 'CANCELLED' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} 
                                    className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                  >
                                    <XCircle className="ms-3 h-4 w-4" />
                                    <span>إلغاء الطلب</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(order.id)} 
                                  className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                >
                                  <Trash className="ms-3 h-4 w-4" />
                                  <span>حذف نهائي</span>
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
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium text-slate-500">لا توجد طلبات مطابقة لبحثك</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
