'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash, CheckCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { updateOrderStatus, deleteOrder } from '@/app/actions/admin/orders'
import { toast } from 'sonner'

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

export default function OrdersClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')

  const handleUpdateStatus = async (id: string, newStatus: any) => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الطلبات</h1>
          <p className="text-slate-500 mt-1">إدارة طلبات المتجر ومتابعة حالتها.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-slate-600 bg-white rounded-xl">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="ابحث برقم الطلب أو اسم العميل..."
                className="pl-4 pr-10 bg-white border-slate-200 focus-visible:ring-primary h-11 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-slate-600 bg-white rounded-xl">
                <Filter className="w-4 h-4 ml-2" />
                تصفية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-right font-medium">رقم الطلب</TableHead>
                  <TableHead className="text-right font-medium">العميل</TableHead>
                  <TableHead className="text-right font-medium">التاريخ</TableHead>
                  <TableHead className="text-right font-medium">الإجمالي</TableHead>
                  <TableHead className="text-right font-medium">الحالة</TableHead>
                  <TableHead className="text-center font-medium">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.filter(o => o.orderNumber.includes(search) || o.customer.includes(search)).map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-bold text-slate-800 font-mono text-sm">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{order.customer}</div>
                      <div className="text-xs text-slate-500">{order.products} منتجات</div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">{order.date}</TableCell>
                    <TableCell className="font-bold text-primary">{order.total.toLocaleString('en-US')} د.ع</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.status === 'COMPLETED' || order.status === 'DELIVERED'
                            ? 'border-0 bg-emerald-100 text-emerald-700'
                            : order.status === 'PENDING' || order.status === 'PROCESSING'
                            ? 'border-0 bg-amber-100 text-amber-700'
                            : order.status === 'SHIPPED'
                            ? 'border-0 bg-blue-100 text-blue-700'
                            : 'border-0 bg-rose-100 text-rose-700'
                        }
                      >
                        {order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'تم التوصيل' : order.status === 'SHIPPED' ? 'تم الشحن' : order.status === 'PENDING' ? 'قيد التنفيذ' : order.status === 'PROCESSING' ? 'جاري التجهيز' : 'ملغى'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0 text-slate-500 rounded-lg" })}>
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-100">
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-slate-400" />
                            <span>عرض التفاصيل</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">تحديث الحالة</div>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'PROCESSING')} className="rounded-lg cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500" />
                            <span>جاري التجهيز</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="rounded-lg cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-blue-500" />
                            <span>تم الشحن</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="rounded-lg cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                            <span>تم التوصيل</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-rose-500" />
                            <span>إلغاء الطلب</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-lg cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>حذف الطلب نهائياً</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      لا يوجد طلبات لعرضها
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
