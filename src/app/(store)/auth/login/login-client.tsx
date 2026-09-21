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

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
      } else {
        toast.success('مرحباً بك! تم تسجيل الدخول بنجاح')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء تسجيل الدخول')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#C9A96E]/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-[#E85D75]/5 rounded-full blur-[100px] translate-y-1/2" />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle, #C9A96E 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
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
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_4px_16px_rgba(201,169,110,0.35)] transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
            >
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#1C1917]">گِفتي بلس</span>
          </Link>
          <h1 className="text-2xl font-black text-[#1C1917]">أهلاً بعودتك</h1>
          <p className="mt-1.5 text-sm text-[#78716C]">سجل دخولك لمتابعة طلباتك وقائمة أمنياتك</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-8 py-9">
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#1C1917] mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-[#1C1917]">
                  كلمة المرور
                </label>
                <a href="#" className="text-xs font-semibold text-[#C9A96E] hover:underline">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
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
          <div className="mt-6 pt-5 border-t border-[#E8E4DF] flex items-center justify-between text-xs text-[#78716C]">
            <Link
              href="/auth/admin-login"
              className="inline-flex items-center gap-1.5 font-bold text-[#C9A96E] hover:underline"
            >
              <Shield className="w-3.5 h-3.5" />
              دخول فريق الإدارة
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#1C1917] transition-colors"
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
