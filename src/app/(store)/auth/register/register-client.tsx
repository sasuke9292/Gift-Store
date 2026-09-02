'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function RegisterClient() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'حدث خطأ أثناء التسجيل')
        setLoading(false)
        return
      }

      toast.success('تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...')
      
      // Auto login after registration
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('حدث خطأ غير متوقع')
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Decorative bg */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-white font-bold text-3xl shadow-lg shadow-primary/30 mb-6 hover:scale-105 transition-transform">
            G
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">انضم لعائلتنا!</h2>
          <p className="mt-3 text-slate-500">أنشئ حسابك الآن وابدأ رحلة البحث عن الهدايا المثالية</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-2xl shadow-blue-900/5 sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pe-12 bg-slate-50 border-slate-200 focus:bg-white"
                  placeholder="الاسم الثلاثي"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pe-12 bg-slate-50 border-slate-200 focus:bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pe-12 bg-slate-50 border-slate-200 focus:bg-white"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-xl shadow-md" disabled={loading}>
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">أو عبر</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleGoogleLogin} 
                variant="outline" 
                className="w-full h-12 rounded-xl text-slate-700 font-bold border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              >
                <svg className="w-5 h-5 ms-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                المتابعة باستخدام جوجل
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              تسجيل الدخول
              <ArrowRight className="inline-block w-4 h-4 me-1" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
