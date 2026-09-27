'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowRight, Mail, Lock, Gift, Loader2, Shield } from 'lucide-react'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()

    try {
      const result = await signIn('credentials', {
        email: cleanEmail,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
      } else {
        toast.success('مرحباً بك! تم تسجيل الدخول بنجاح')
        setTimeout(() => {
          window.location.href = callbackUrl
        }, 200)
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء تسجيل الدخول')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#13213c]/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] translate-y-1/2" />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle, #13213c 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_4px_16px_rgba(19,33,60,0.25)] transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
            >
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">گِفتي بلس</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">أهلاً بعودتك</h1>
          <p className="mt-1.5 text-sm text-slate-500">سجل دخولك لمتابعة طلباتك وقائمة أمنياتك</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_30px_rgba(15,23,42,0.06)] px-8 py-9">
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]/50 text-start"
                  placeholder="name@example.com"
                  dir="ltr"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-900">
                  كلمة المرور
                </label>
                <a href="#" className="text-xs font-semibold text-[#13213c] hover:underline">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 shadow-md shadow-[#13213c]/20 hover:shadow-lg hover:shadow-[#13213c]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Admin link */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/auth/admin-login"
              className="inline-flex items-center gap-1.5 font-bold text-[#13213c] hover:underline"
            >
              <Shield className="w-3.5 h-3.5" />
              دخول فريق الإدارة
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              الرئيسية
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
