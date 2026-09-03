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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '')
  const addItem = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  
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
    <div className="bg-[#050B14] min-h-screen py-32 relative overflow-hidden text-white">
      {/* 3D Depth Background */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 perspective-[1000px]"
          >
            <div className="aspect-square glass-card rounded-3xl overflow-hidden relative group transform hover:rotate-y-2 hover:rotate-x-2 transition-transform duration-700 ease-out border-white/5 shadow-2xl">
              {product.isBestSeller && (
                <Badge className="absolute top-6 start-6 z-10 bg-amber-500 shadow-[0_5px_15px_rgba(245,158,11,0.4)] text-[#050B14] font-bold text-sm px-4 py-1">الأكثر مبيعاً</Badge>
              )}
              <div className="w-full h-full flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-700 relative bg-gradient-to-br from-white/5 to-transparent">
                {activeImage ? (
                  <Image src={activeImage} alt={product.name} fill className="object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" sizes="(max-width: 768px) 100vw, 50vw" />
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
                    className={`relative aspect-square glass-card rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${activeImage === img ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105' : 'border-white/10 hover:border-amber-400/50 hover:scale-105'}`}
                  >
                    <Image src={img} alt={`صورة ${i+1}`} fill className="object-cover opacity-80 hover:opacity-100 transition-opacity" sizes="100px" />
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
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i === 4 ? 'fill-amber-400/30 text-amber-400/30' : 'fill-amber-400'}`} />
                  ))}
                </div>
                <span className="text-slate-400 text-sm font-medium">(4.8) 124 تقييم</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-500 drop-shadow-lg">{product.price.toLocaleString('en-US')} <span className="text-2xl text-amber-500/80">د.ع</span></span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-lg mb-8 drop-shadow-sm">
              {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
            </p>

            {/* Actions */}
            <div className="glass-card rounded-3xl p-8 mb-8 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center justify-between glass-card border border-white/10 rounded-full h-14 p-1 w-full sm:w-auto shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-12 h-12 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg text-white">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-12 h-12 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 rounded-full text-lg shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300">
                  <ShoppingCart className="w-5 h-5 me-2" />
                  إضافة إلى السلة
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className={`rounded-full flex-1 h-12 transition-colors border-white/10 ${isFavorite ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30 hover:text-rose-300' : 'glass-button text-white/80 hover:text-amber-400 hover:bg-white/10'}`}
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
                  <Heart className={`w-5 h-5 me-2 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full shrink-0 glass-button border-white/10 h-12 w-12 text-white/80 hover:text-amber-400 hover:bg-white/10 transition-colors"
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
              <div className="flex flex-col items-center justify-center p-4 glass-card rounded-2xl text-center gap-2 border border-white/5 hover:border-amber-400/30 transition-colors group">
                <ShieldCheck className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white/80">جودة مضمونة</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 glass-card rounded-2xl text-center gap-2 border border-white/5 hover:border-amber-400/30 transition-colors group">
                <Truck className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white/80">شحن سريع</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 glass-card rounded-2xl text-center gap-2 border border-white/5 hover:border-amber-400/30 transition-colors group">
                <RotateCcw className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:-rotate-45 transition-transform" />
                <span className="text-sm font-bold text-white/80">استرجاع مجاني</span>
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
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-white/10 rounded-none p-0 mb-8 gap-8">
              <TabsTrigger 
                value="details"
                className="text-lg pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-amber-400 text-slate-400 font-bold px-0 transition-colors"
              >
                التفاصيل والمميزات
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="text-lg pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-amber-400 text-slate-400 font-bold px-0 transition-colors"
              >
                التقييمات (124)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-400" />
                  مميزات المنتج
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-300 text-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                    المنتج أصلي ومضمون
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                    التصنيف: <span className="font-bold text-white ms-1">{product.category}</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4 animate-in fade-in-50 duration-500">
              <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">التقييمات</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-slate-300">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-white/10 text-white/20" />
                        ))}
                      </div>
                      <span className="text-white font-bold ms-2">0 من 5</span>
                      <span className="text-slate-400 text-sm">(0 تقييم)</span>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger render={<Button className="rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-lg h-12 px-6 hidden sm:flex text-md font-bold transition-colors">إضافة تقييم</Button>}>
                      إضافة تقييم
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass-card border-white/10 text-white" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-start text-xl font-bold text-white">تقييم المنتج</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">ما هو تقييمك؟</label>
                          <div className="flex gap-2 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              return (
                                <Star 
                                  key={i} 
                                  className={`w-8 h-8 transition-colors drop-shadow-md ${
                                    starValue <= (hoverRating || rating) 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-white/20'
                                  }`}
                                  onMouseEnter={() => setHoverRating(starValue)}
                                  onClick={() => setRating(starValue)}
                                />
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">اكتب رأيك (اختياري)</label>
                          <Textarea placeholder="شاركنا رأيك بالمنتج..." className="resize-none h-24 rounded-xl text-start bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 focus:bg-white/10" dir="rtl" />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose render={<Button className="w-full sm:w-auto rounded-xl bg-amber-500 text-[#050B14] font-bold hover:bg-amber-400">إرسال التقييم</Button>} onClick={() => toast.success('شكراً لتقييمك! تمت إضافة التقييم بنجاح.')}>
                          إرسال التقييم
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed backdrop-blur-sm">
                  <Star className="w-16 h-16 text-white/10 mb-4 drop-shadow-lg" />
                  <h4 className="text-lg font-bold text-white mb-2">لا توجد تقييمات بعد</h4>
                  <p className="text-slate-400 max-w-sm mb-6">كن أول من يقيّم هذا المنتج وشارك رأيك مع الآخرين!</p>
                  
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" className="rounded-xl shadow-lg glass-button border-white/10 h-12 px-6 text-md font-bold sm:hidden text-white">إضافة تقييم</Button>}>
                      إضافة تقييم
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass-card border-white/10 text-white" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-start text-xl font-bold text-white">تقييم المنتج</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">ما هو تقييمك؟</label>
                          <div className="flex gap-2 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              return (
                                <Star 
                                  key={i} 
                                  className={`w-8 h-8 transition-colors drop-shadow-md ${
                                    starValue <= (hoverRating || rating) 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-white/20'
                                  }`}
                                  onMouseEnter={() => setHoverRating(starValue)}
                                  onClick={() => setRating(starValue)}
                                />
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-2">اكتب رأيك (اختياري)</label>
                          <Textarea placeholder="شاركنا رأيك بالمنتج..." className="resize-none h-24 rounded-xl text-start bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 focus:bg-white/10" dir="rtl" />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose render={<Button className="w-full sm:w-auto rounded-xl bg-amber-500 text-[#050B14] font-bold hover:bg-amber-400">إرسال التقييم</Button>} onClick={() => toast.success('شكراً لتقييمك! تمت إضافة التقييم بنجاح.')}>
                          إرسال التقييم
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

      </div>
    </div>
  )
}
