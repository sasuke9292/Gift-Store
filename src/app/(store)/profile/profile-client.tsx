'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, MapPin, LogOut, Edit2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { logoutAction } from '@/app/actions/auth'
import { useTransition } from 'react'

interface ProfileClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
  orders: any[]
}

export default function ProfileClient({ user, orders }: ProfileClientProps) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 shrink-0 space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold mx-auto border-4 border-white shadow-md">
                  {user.name?.[0]?.toUpperCase() || 'أ'}
                </div>
                <Button size="icon" className="absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-md bg-white text-slate-600 hover:bg-slate-50 hover:text-primary">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{user.name || 'مستخدم بدون اسم'}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              
              <Button 
                variant="outline" 
                className="w-full rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut className="w-4 h-4 ml-2" />
                {isPending ? 'جاري الخروج...' : 'تسجيل الخروج'}
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="w-full justify-start h-auto bg-transparent border-b border-slate-200 rounded-none p-0 mb-8 gap-8 overflow-x-auto">
                  <TabsTrigger 
                    value="orders"
                    className="text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 font-medium px-0 flex items-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    طلباتي
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details"
                    className="text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 font-medium px-0 flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    المعلومات الشخصية
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses"
                    className="text-base pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 font-medium px-0 flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    العناوين المحفوظة
                  </TabsTrigger>
                </TabsList>

                {/* Orders Tab */}
                <TabsContent value="orders" className="animate-in fade-in-50 duration-500">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">سجل الطلبات</h3>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-10 text-slate-500">
                        لا توجد طلبات سابقة.
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="p-4 sm:p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-slate-800">{order.orderNumber}</span>
                              <Badge 
                                className={
                                  order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                  order.status === 'PENDING' || order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                  'bg-red-100 text-red-700 hover:bg-red-100'
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-IQ')}</p>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                            <span className="font-bold text-lg text-primary">{order.total.toLocaleString('en-US')} د.ع</span>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              التفاصيل
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="animate-in fade-in-50 duration-500">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">المعلومات الشخصية</h3>
                  <form className="space-y-6 max-w-lg">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input id="name" defaultValue={user.name || ''} className="h-12 bg-slate-50 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} className="h-12 bg-slate-50 rounded-xl" dir="ltr" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input id="phone" defaultValue="0770 123 4567" className="h-12 bg-slate-50 rounded-xl" dir="ltr" />
                      </div>
                    </div>
                    <Button size="lg" className="h-12 rounded-xl px-8 shadow-md">
                      حفظ التغييرات
                    </Button>
                  </form>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses" className="animate-in fade-in-50 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">العناوين المحفوظة</h3>
                    <Button variant="outline" className="rounded-xl">
                      إضافة عنوان جديد
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 relative">
                      <Badge className="absolute top-4 left-4 bg-primary text-white">الافتراضي</Badge>
                      <MapPin className="w-6 h-6 text-primary mb-3" />
                      <h4 className="font-bold text-slate-800 mb-1">المنزل</h4>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        بغداد, الكرادة<br />
                        شارع 62, محلة 903, زقاق 12, دار 4
                      </p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-500">تعديل</Button>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-red-500">حذف</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
