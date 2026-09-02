'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowRight, Mail, Lock } from 'lucide-react'

export default function AdminLoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      loginType: 'admin',
      redirect: false,
    })

    if (result?.error) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
    } else {
      toast.success('تم تسجيل الدخول بنجاح!')
      const session = await getSession()
      const role = session?.user?.role || 'CUSTOMER'
      
      if (role === 'CUSTOMER') {
        router.push('/')
      } else {
        router.push('/admin')
      }
      router.refresh()
    }
  }

  const handleGoogleLogin = () => {
    toast.error('تسجيل الدخول عبر جوجل غير متاح لحسابات الإدارة')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Decorative bg */}
      <div className="absolute top-0 start-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 end-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-indigo-900 rounded-2xl text-white font-bold text-3xl shadow-lg shadow-indigo-900/30 mb-6 hover:scale-105 transition-transform">
            G
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">بوابة الإدارة</h2>
          <p className="mt-3 text-slate-500">سجل دخولك للوصول إلى لوحة التحكم الخاصة بفريق العمل</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-2xl shadow-blue-900/5 sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-12 bg-slate-50 border-slate-200 focus:bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-12 bg-slate-50 border-slate-200 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ms-2 block text-sm text-slate-600">
                  تذكرني
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary/80">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول للوحة التحكم'}
            </Button>
          </form>

          <div className="mt-8">
            <Link href="/auth/login" className="w-full block text-center mt-6 text-sm text-slate-500 hover:text-indigo-600 font-medium">
              <ArrowRight className="inline-block w-4 h-4 me-1 rotate-180" />
              العودة إلى متجر العملاء
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
