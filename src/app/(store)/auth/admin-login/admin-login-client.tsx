'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, Mail, Lock, Shield, Loader2, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdminLoginClient() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    const cleanedEmail = email.trim().toLowerCase()

    try {
      const result = await signIn('credentials', {
        email: cleanedEmail,
        password,
        loginType: 'admin',
        redirect: false,
      })

      if (result?.error) {
        setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة، أو ليس لديك صلاحية مدير')
        toast.error('فشل تسجيل الدخول. يرجى التحقق من البيانات')
        setLoading(false)
      } else {
        toast.success('تم تسجيل الدخول بنجاح! جاري تحويلك...')
        // Force full page load on mobile / WebView to guarantee fresh session cookie
        setTimeout(() => {
          window.location.href = callbackUrl
        }, 300)
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء الاتصال بالخادم')
      toast.error('حدث خطأ أثناء تسجيل الدخول')
      setLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setEmail('admin@admin.com')
    setPassword('Admin123')
    setErrorMessage(null)
    toast.info('تمت تعبئة بيانات حساب المدير التجريبي')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#13213c]/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-[#13213c]/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(19,33,60,0.25)]"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">بوابة إدارة المتجر</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#78716C] font-medium">سجّل دخولك للوصول إلى لوحة التحكم والعمليات</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_4px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Quick Demo Credentials Pill for Mobile Ease */}
          <div className="p-3 rounded-2xl bg-[#F0F4F9]/70 border border-[#13213c]/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#13213c] shrink-0" />
              <div className="text-[11px] text-[#13213c] font-bold truncate">
                حساب المدير الافتراضي
              </div>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="px-2.5 py-1 text-[11px] font-black rounded-xl bg-[#13213c] text-white hover:bg-[#22385e] transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              تعبئة تلقائية
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                البريد الإلكتروني للمدير
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-2 focus-visible:ring-[#13213c]/20 focus-visible:border-[#13213c] focus:bg-white"
                  placeholder="admin@admin.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="ps-10 pe-11 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-2 focus-visible:ring-[#13213c]/20 focus-visible:border-[#13213c] focus:bg-white"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917] p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ms-2" />
                  جاري تسجيل الدخول والتحقق...
                </>
              ) : (
                'تسجيل الدخول إلى لوحة التحكم'
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="pt-4 border-t border-[#E8E4DF] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#78716C] hover:text-[#13213c] transition-colors py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              العودة إلى متجر العملاء
            </Link>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-[11px] text-[#A8A29E] mt-4 flex items-center justify-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          جلسة تسجيل دخول مشفرة ومؤمنة بالكامل
        </p>
      </motion.div>
    </div>
  )
}

