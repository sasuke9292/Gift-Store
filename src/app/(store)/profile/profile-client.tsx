'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, Heart, LogOut, Settings, MapPin, ChevronLeft, Camera, ShoppingBag, Edit3 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useFavoritesStore } from '@/lib/store'
import { ProductCard } from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  const [activeTab, setActiveTab] = useState('personal')

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const tabs = [
    { id: 'personal', label: 'المعلومات الشخصية', icon: User },
    { id: 'orders', label: 'طلباتي', icon: ShoppingBag },
    { id: 'addresses', label: 'عناويني', icon: MapPin },
    { id: 'favorites', label: 'المفضلة', icon: Heart, count: mounted ? favorites.length : 0 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">المعلومات الشخصية</h2>
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
                <Edit3 className="w-4 h-4 ms-2" />
                تعديل
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-500 mb-2 block">الاسم الكامل</Label>
                  <p className="text-lg font-bold text-slate-800">{user.name}</p>
                </div>
                <div>
                  <Label className="text-slate-500 mb-2 block">البريد الإلكتروني</Label>
                  <p className="text-lg font-medium text-slate-800">{user.email}</p>
                </div>
                <div>
                  <Label className="text-slate-500 mb-2 block">رقم الهاتف</Label>
                  <p className="text-lg font-medium text-slate-800" dir="ltr">{user.phone || 'غير محدد'}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-slate-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-800">{orders.length}</h3>
                <p className="text-slate-500 font-medium">إجمالي الطلبات</p>
              </div>
            </div>
          </motion.div>
        )
      case 'orders':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">سجل الطلبات</h2>
            
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد طلبات سابقة</h3>
                <p className="text-slate-500 mb-8 max-w-md">لم تقم بإجراء أي طلبات حتى الآن. استكشف متجرنا وابدأ بالتسوق!</p>
                <Button onClick={() => window.location.href = '/shop'} className="rounded-xl h-14 px-8 shadow-lg shadow-primary/20 text-lg">
                  تصفح المنتجات
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all gap-4 group">
                    <div className="flex-1 w-full flex justify-between md:justify-start md:gap-12">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">رقم الطلب</p>
                        <p className="font-black text-slate-800">#{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">التاريخ</p>
                        <p className="font-bold text-slate-700">{new Date(order.date).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">الإجمالي</p>
                        <p className="font-black text-primary">{order.total.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-400">د.ع</span></p>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                        order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 
                        order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status === 'PENDING' ? 'قيد المراجعة' : 
                         order.status === 'SHIPPED' ? 'تم الشحن' : 
                         order.status === 'DELIVERED' ? 'مكتمل' : 
                         order.status}
                      </span>
                      <Button variant="ghost" className="rounded-xl text-slate-500 group-hover:text-primary transition-colors">
                        التفاصيل
                        <ChevronLeft className="w-4 h-4 me-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )
      case 'addresses':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">عناويني</h2>
              <Button className="rounded-xl h-12 px-6 shadow-md shadow-primary/20">
                <MapPin className="w-4 h-4 ms-2" />
                إضافة عنوان جديد
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-slate-300">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد عناوين محفوظة</h3>
              <p className="text-slate-500 max-w-md">قم بإضافة عنوان لتسهيل عملية إتمام الطلب في المرات القادمة.</p>
            </div>
          </motion.div>
        )
      case 'favorites':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]"
          >
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-slate-800">المفضلة</h2>
            </div>
            
            {!mounted || favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-rose-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">قائمتك المفضلة فارغة</h3>
                <p className="text-slate-500 mb-6 max-w-md">لم تقم بإضافة أي منتجات للمفضلة بعد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
          </motion.div>
        )
      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-8">إعدادات الحساب</h2>
            <div className="max-w-2xl space-y-6">
              <div>
                <Label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الكامل</Label>
                <Input type="text" defaultValue={user.name} className="h-14 px-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-md" />
              </div>
              <div>
                <Label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني</Label>
                <Input type="email" defaultValue={user.email} disabled className="h-14 px-4 rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed opacity-70" />
              </div>
              <div>
                <Label className="block text-sm font-semibold text-slate-700 mb-2">رقم الهاتف</Label>
                <Input type="tel" defaultValue={user.phone} placeholder="رقم الهاتف" className="h-14 px-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-md" dir="ltr" />
              </div>
              <div className="pt-6">
                <Button className="h-14 px-10 rounded-xl shadow-lg shadow-primary/20 text-lg font-bold w-full md:w-auto">
                  حفظ التعديلات
                </Button>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-[#FBFBFD] min-h-screen py-12 md:py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            {/* User Profile Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-6 text-center relative overflow-hidden">
              <div className="absolute top-0 start-0 end-0 h-32 bg-gradient-to-br from-primary/10 to-blue-500/10"></div>
              
              <div className="relative mb-6 mx-auto w-28 h-28">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/5 border-4 border-white z-10 relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-5xl font-black">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <button className="absolute bottom-0 start-0 bg-white p-2 rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-primary transition-colors z-20">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <h1 className="text-2xl font-black text-slate-800 mb-1 relative z-10">{user.name}</h1>
              <p className="text-slate-500 font-medium relative z-10">{user.email}</p>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className={`w-5 h-5 ms-3 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                      {tab.label}
                    </div>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center p-4 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5 ms-3 text-rose-400" />
                    تسجيل الخروج
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
