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
import { Search, Filter, Download, MoreVertical, Eye, Ban, Mail, CheckCircle2, ShoppingBag, MapPin, Phone, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface CustomerData {
  id: string
  name: string
  email: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
  status: string
  phone?: string
  address?: string
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: CustomerData[] }) {
  const [customers, setCustomers] = useState(
    initialCustomers.map(c => ({
      ...c,
      phone: c.phone || '0750 123 4567',
      address: c.address || 'العراق، بغداد، الكرادة'
    }))
  )
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)

  const filteredCustomers = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || 
         c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'جاري تجهيز ملف البيانات...',
        success: 'تم تصدير بيانات العملاء بنجاح كملف CSV',
        error: 'حدث خطأ أثناء التصدير',
      }
    )
  }

  const handleBlockCustomer = (id: string, name: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'نشط' ? 'محظور' : 'نشط' } : c))
    toast.success(`تم تغيير حالة العميل ${name}`)
  }

  const handleSendEmail = (email: string) => {
    toast.info(`سيتم فتح تطبيق البريد لإرسال رسالة إلى ${email}`)
    window.location.href = `mailto:${email}`
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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إدارة العملاء</h1>
          <p className="text-slate-500 font-medium">متابعة تفاصيل العملاء، تاريخ الشراء، وحالة الحسابات.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleExport}
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl h-12 px-6 font-bold transition-all shadow-none"
          >
            <Download className="w-5 h-5 me-2" />
            تصدير البيانات
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث عن عميل بالاسم أو الإيميل..."
              className="pe-4 ps-12 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-14 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm" onClick={() => toast.info('جاري تطوير فلاتر متقدمة قريباً')}>
            <Filter className="w-5 h-5 me-2 text-slate-500" />
            تصفية متقدمة
          </Button>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-end font-bold text-slate-600 py-5 px-8">العميل</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">البريد الإلكتروني</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">الانضمام</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5">الطلبات</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">إجمالي المشتريات</TableHead>
                  <TableHead className="text-end font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-8">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group"
                    >
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-md group-hover:text-indigo-600 transition-colors">{customer.name}</span>
                            <span className="text-xs text-slate-400 font-medium font-mono">#{customer.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium" dir="rtl">{customer.email}</TableCell>
                      <TableCell className="text-slate-500 font-medium">{customer.joinedAt}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 font-bold rounded-xl border-0 shadow-sm">
                          {customer.ordersCount} طلب
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-indigo-600 text-lg">
                        {customer.totalSpent.toLocaleString('en-US')} <span className="text-xs text-slate-400 font-bold">د.ع</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`px-3 py-1.5 rounded-xl font-bold border-0 flex items-center gap-2 w-max shadow-sm ${
                            customer.status === 'نشط'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${customer.status === 'نشط' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsCustomerModalOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            onClick={() => handleSendEmail(customer.email)}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-9 w-9 p-0 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center">
                              <span className="sr-only">خيارات</span>
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                              <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5 uppercase">إدارة الحساب</DropdownMenuLabel>
                              <DropdownMenuItem 
                                className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => handleBlockCustomer(customer.id, customer.name)}
                              >
                                {customer.status === 'نشط' ? (
                                  <>
                                    <Ban className="me-3 h-4 w-4" />
                                    <span>حظر الحساب</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="me-3 h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-600">تفعيل الحساب</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium text-slate-500">لم يتم العثور على أي عميل بهذا الاسم</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl" dir="rtl">
          {selectedCustomer && (
            <>
              <div className="bg-slate-50/50 p-8 text-center relative border-b border-slate-100">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl font-black text-indigo-600 shadow-xl shadow-indigo-600/10 border-4 border-white">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-black text-slate-800">{selectedCustomer.name}</h2>
                <Badge variant="outline" className={`mt-3 px-4 py-1.5 rounded-full font-bold border-0 shadow-sm ${selectedCustomer.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {selectedCustomer.status}
                </Badge>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-2 text-indigo-600/80 mb-2 font-medium">
                      <ShoppingBag className="w-4 h-4" />
                      الطلبات
                    </div>
                    <div className="text-2xl font-black text-indigo-600">{selectedCustomer.ordersCount}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      تاريخ الانضمام
                    </div>
                    <div className="text-lg font-bold text-slate-800 mt-1">{selectedCustomer.joinedAt}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">البريد الإلكتروني</p>
                      <p className="font-bold text-slate-800 text-sm" dir="rtl">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">رقم الهاتف</p>
                      <p className="font-bold text-slate-800 text-sm" dir="rtl">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">العنوان الأساسي</p>
                      <p className="font-bold text-slate-800 text-sm">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20" onClick={() => setIsCustomerModalOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
