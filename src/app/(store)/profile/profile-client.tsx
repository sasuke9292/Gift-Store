'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { User, Package, Heart, LogOut, Settings, MapPin } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useFavoritesStore } from '@/lib/store'
import { ProductCard } from '@/components/store/product-card'

interface ProfileProps {
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
  orders: any[]
}

export default function ProfileClient({ user, orders }: ProfileProps) {
  const favorites = useFavoritesStore(state => state.items)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-[#FBFBFD] min-h-screen py-12 md:py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">أهلاً، {user.name}</h1>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 px-6">
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="flex flex-wrap w-full md:w-auto h-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 gap-2">
            <TabsTrigger value="orders" className="flex-1 md:flex-none text-lg py-3 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
              <Package className="w-5 h-5 ml-2" />
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1 md:flex-none text-lg py-3 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
              <Heart className="w-5 h-5 ml-2" />
              المفضلة ({mounted ? favorites.length : 0})
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 md:flex-none text-lg py-3 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
              <Settings className="w-5 h-5 ml-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">سجل الطلبات</h2>
              
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد طلبات سابقة</h3>
                  <p className="text-slate-500 mb-6 max-w-md">لم تقم بإجراء أي طلبات حتى الآن. استكشف متجرنا وابدأ بالتسوق!</p>
                  <Button onClick={() => window.location.href = '/shop'} className="rounded-full h-12 px-8 shadow-md">
                    تصفح المنتجات
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors gap-4">
                      <div className="flex-1 w-full flex justify-between md:justify-start md:gap-12">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">رقم الطلب</p>
                          <p className="font-bold text-slate-800">#{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">التاريخ</p>
                          <p className="font-medium text-slate-700">{new Date(order.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">الإجمالي</p>
                          <p className="font-bold text-primary">{order.total.toLocaleString('en-US')} د.ع</p>
                        </div>
                      </div>
                      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-200 pt-4 md:pt-0">
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {order.status === 'PENDING' ? 'قيد المراجعة' : order.status === 'SHIPPED' ? 'تم الشحن' : order.status}
                        </span>
                        <Button variant="outline" className="rounded-xl border-slate-200">
                          التفاصيل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-bold text-slate-800">المفضلة</h2>
              </div>
              
              {!mounted || favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">قائمتك المفضلة فارغة</h3>
                  <p className="text-slate-500 mb-6 max-w-md">لم تقم بإضافة أي منتجات للمفضلة بعد.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((product, index) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProductCard 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          salePrice: product.salePrice,
                          images: product.image ? [product.image] : undefined,
                          category: product.category ? { name: product.category } : undefined,
                          isNew: product.isNew,
                          isBestSeller: product.isBestSeller,
                        }} 
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">إعدادات الحساب</h2>
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الكامل</label>
                  <input type="text" defaultValue={user.name} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني</label>
                  <input type="email" defaultValue={user.email} disabled className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">رقم الهاتف</label>
                  <input type="tel" defaultValue={user.phone} placeholder="رقم الهاتف" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="pt-4">
                  <Button className="h-12 px-8 rounded-xl shadow-md text-lg">
                    حفظ التعديلات
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
