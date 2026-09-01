'use client'

import React, { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gift, Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await loginAction(formData)
      if (res?.error) {
        setError(res.error)
        toast.error(res.error)
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
        if (res?.role === 'SUPER_ADMIN' || res?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/profile')
        }
        router.refresh()
      }
    })
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">تسجيل الدخول</h2>
          <p className="mt-2 text-sm text-slate-500">مرحباً بك مجدداً في متجر الهدايا</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  name="email"
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-4 pr-12 h-12 bg-slate-50 rounded-xl border-transparent focus:bg-white text-left" 
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  name="password"
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-4 pr-12 h-12 bg-slate-50 rounded-xl border-transparent focus:bg-white text-left" 
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </div>

          <Button disabled={isPending} type="submit" size="lg" className="w-full h-14 rounded-xl shadow-md hover:scale-[1.02] transition-transform text-lg flex items-center justify-center">
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                جاري التحقق...
              </>
            ) : 'تسجيل الدخول'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          ليس لديك حساب؟{' '}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
