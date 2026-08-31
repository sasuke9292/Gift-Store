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
import { Search, Filter, Download, MoreHorizontal, Eye, Ban, Mail } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface CustomerData {
  id: string
  name: string
  email: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
  status: string
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: CustomerData[] }) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')

  const filteredCustomers = customers.filter(
    c => c.name.includes(search) || c.email.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">العملاء</h1>
          <p className="text-slate-500 mt-1">إدارة عملاء المتجر ومتابعة طلباتهم.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-slate-600 bg-white rounded-xl">
            <Download className="w-4 h-4 ml-2" />
            تصدير بيانات العملاء
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
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
                  <TableHead className="text-right font-medium">العميل</TableHead>
                  <TableHead className="text-right font-medium">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right font-medium">تاريخ الانضمام</TableHead>
                  <TableHead className="text-center font-medium">الطلبات</TableHead>
                  <TableHead className="text-right font-medium">إجمالي المشتريات</TableHead>
                  <TableHead className="text-right font-medium">الحالة</TableHead>
                  <TableHead className="text-center font-medium">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="font-bold text-slate-800">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono text-sm">{customer.email}</TableCell>
                    <TableCell className="text-slate-500">{customer.joinedAt}</TableCell>
                    <TableCell className="text-center font-medium text-slate-700">{customer.ordersCount}</TableCell>
                    <TableCell className="font-bold text-primary">{customer.totalSpent.toLocaleString('en-US')} د.ع</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          customer.status === 'نشط'
                            ? 'border-0 bg-emerald-100 text-emerald-700'
                            : 'border-0 bg-rose-100 text-rose-700'
                        }
                      >
                        {customer.status}
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
                            <span>عرض الملف</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Mail className="mr-2 h-4 w-4 text-slate-400" />
                            <span>إرسال بريد</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-amber-600 focus:text-amber-600 focus:bg-amber-50 rounded-lg cursor-pointer">
                            <Ban className="mr-2 h-4 w-4" />
                            <span>حظر العميل</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      لا يوجد عملاء لعرضهم
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
