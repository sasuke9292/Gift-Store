'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'

export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '')
  const addItem = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  
  const isFavorite = hasFavorite(product.id)

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      quantity: quantity
    })
    toast.success('تمت إضافة المنتج إلى السلة', { id: `cart-${product.id}` })
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group">
              {product.isBestSeller && (
                <Badge className="absolute top-6 right-6 z-10 bg-blue-500 shadow-md text-sm px-3 py-1">الأكثر مبيعاً</Badge>
              )}
              <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500 relative">
                {activeImage ? (
                  <Image src={activeImage} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <span>صورة المنتج</span>
                )}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square bg-slate-50 rounded-2xl cursor-pointer border-2 transition-colors overflow-hidden ${activeImage === img ? 'border-primary shadow-sm' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <Image src={img} alt={`صورة ${i+1}`} fill className="object-cover" sizes="100px" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i === 4 ? 'fill-yellow-400/30' : 'fill-yellow-400'}`} />
                  ))}
                </div>
                <span className="text-slate-500 text-sm font-medium">(4.8) 124 تقييم</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">{product.price.toLocaleString('en-US')} د.ع</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
            </p>

            {/* Actions */}
            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-full h-14 p-1 w-full sm:w-auto shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-12 h-12 text-slate-500 hover:text-slate-800 shrink-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg text-slate-800">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-12 h-12 text-slate-500 hover:text-slate-800 shrink-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 rounded-full text-lg shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-300">
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  إضافة إلى السلة
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className={`rounded-full flex-1 h-12 transition-colors ${isFavorite ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700' : 'bg-white text-slate-700 hover:text-primary hover:border-primary'}`}
                  onClick={() => {
                    if (isFavorite) {
                      removeFavorite(product.id)
                      toast.info('تمت الإزالة من المفضلة', { id: `fav-rem-${product.id}` })
                    } else {
                      addFavorite({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        salePrice: product.salePrice,
                        image: product.images?.[0],
                        category: product.category,
                        isNew: product.isNew,
                        isBestSeller: product.isBestSeller,
                      })
                      toast.success('تمت الإضافة للمفضلة', { id: `fav-add-${product.id}` })
                    }
                  }}
                >
                  <Heart className={`w-5 h-5 ml-2 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full shrink-0 bg-white h-12 w-12 text-slate-600 hover:text-primary hover:border-primary transition-colors"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        url: window.location.href,
                      }).catch(() => {})
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('تم نسخ الرابط بنجاح')
                    }
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-2xl text-center gap-2 border border-primary/10">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-slate-700">جودة مضمونة</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-2xl text-center gap-2 border border-primary/10">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-slate-700">شحن سريع</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-2xl text-center gap-2 border border-primary/10">
                <RotateCcw className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-slate-700">استرجاع مجاني</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-slate-200 rounded-none p-0 mb-8 gap-8">
              <TabsTrigger 
                value="details"
                className="text-lg pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 font-medium px-0"
              >
                التفاصيل والمميزات
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="text-lg pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 font-medium px-0"
              >
                التقييمات (124)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">مميزات المنتج</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    المنتج أصلي ومضمون
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    التصنيف: {product.category}
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">تقييمات العملاء</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i === 4 ? 'fill-yellow-400/30' : 'fill-yellow-400'}`} />
                        ))}
                      </div>
                      <span className="text-slate-700 font-bold">4.8 من 5</span>
                      <span className="text-slate-500 text-sm">(124 تقييم)</span>
                    </div>
                  </div>
                  <Button className="rounded-xl shadow-md h-12 px-6 hidden sm:flex text-md font-bold">إضافة تقييم</Button>
                </div>

                <div className="space-y-6">
                  {/* Mock Review 1 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">A</div>
                      <div>
                        <h4 className="font-bold text-slate-800">أحمد محمد</h4>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="mr-auto text-sm text-slate-400">قبل يومين</span>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">المنتج رائع جداً والتغليف كان ممتاز وفخم. أنصح به بشدة كهدية لمن تحب!</p>
                  </div>
                  
                  {/* Mock Review 2 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">S</div>
                      <div>
                        <h4 className="font-bold text-slate-800">سارة علي</h4>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="mr-auto text-sm text-slate-400">قبل أسبوع</span>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">الجودة ممتازة وسرعة التوصيل خيالية، شكراً گفتي بلس على الخدمة الرائعة والمصداقية.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

      </div>
    </div>
  )
}
