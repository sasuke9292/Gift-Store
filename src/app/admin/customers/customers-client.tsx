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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'

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
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إدارة العملاء</h1>
          <p className="text-slate-500 font-medium">متابعة تفاصيل العملاء، تاريخ الشراء، وحالة الحسابات.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleExport}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl h-12 px-6 font-bold transition-all shadow-none hover:shadow-lg hover:shadow-primary/30"
          >
            <Download className="w-5 h-5 ml-2" />
            تصدير البيانات
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث عن عميل بالاسم أو الإيميل..."
              className="pl-4 pr-12 bg-white border-slate-200 focus:border-primary focus-visible:ring-primary/20 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-14 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm" onClick={() => toast.info('جاري تطوير فلاتر متقدمة قريباً')}>
            <Filter className="w-5 h-5 ml-2 text-slate-500" />
            تصفية متقدمة
          </Button>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-right font-bold text-slate-600 py-5 px-8">العميل</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">الانضمام</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5">الطلبات</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">إجمالي المشتريات</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-8">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 group">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/20 to-blue-500/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-md">{customer.name}</span>
                          <span className="text-xs text-slate-400 font-medium">ID: #{customer.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">{customer.email}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{customer.joinedAt}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 font-bold rounded-lg border-0">
                        {customer.ordersCount} طلب
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-slate-800 text-lg">
                      {customer.totalSpent.toLocaleString('en-US')} <span className="text-sm text-slate-400 font-bold">د.ع</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`px-4 py-1.5 rounded-xl font-bold border-0 flex items-center gap-2 w-max shadow-sm ${
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
                      <DropdownMenu>
                        <DropdownMenuTrigger className="mx-auto h-10 w-10 p-0 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center">
                          <span className="sr-only">خيارات</span>
                          <MoreVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100 p-2">
                          <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5 uppercase">إدارة العميل</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="rounded-xl cursor-pointer py-2.5 hover:bg-slate-50 font-medium text-slate-700"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsCustomerModalOpen(true)
                            }}
                          >
                            <Eye className="ml-3 h-4 w-4 text-primary" />
                            <span>عرض التفاصيل</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="rounded-xl cursor-pointer py-2.5 hover:bg-slate-50 font-medium text-slate-700"
                            onClick={() => handleSendEmail(customer.email)}
                          >
                            <Mail className="ml-3 h-4 w-4 text-amber-500" />
                            <span>مراسلة العميل</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem 
                            className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleBlockCustomer(customer.id, customer.name)}
                          >
                            {customer.status === 'نشط' ? (
                              <>
                                <Ban className="ml-3 h-4 w-4" />
                                <span>حظر الحساب</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="ml-3 h-4 w-4" />
                                <span>تفعيل الحساب</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium">لم يتم العثور على أي عميل بهذا الاسم</span>
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
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] border-0" dir="rtl">
          {selectedCustomer && (
            <>
              <div className="bg-slate-50 p-8 text-center relative border-b border-slate-100">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black text-primary shadow-xl shadow-primary/10 border-4 border-white">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                <Badge variant="outline" className={`mt-3 px-4 py-1 rounded-full font-bold border-0 ${selectedCustomer.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {selectedCustomer.status}
                </Badge>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      الطلبات
                    </div>
                    <div className="text-2xl font-black text-slate-800">{selectedCustomer.ordersCount}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      تاريخ الانضمام
                    </div>
                    <div className="text-lg font-bold text-slate-800 mt-1">{selectedCustomer.joinedAt}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">البريد الإلكتروني</p>
                      <p className="font-bold text-slate-800 text-sm" dir="ltr">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">رقم الهاتف</p>
                      <p className="font-bold text-slate-800 text-sm" dir="ltr">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">العنوان الأساسي</p>
                      <p className="font-bold text-slate-800 text-sm">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20" onClick={() => setIsCustomerModalOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
