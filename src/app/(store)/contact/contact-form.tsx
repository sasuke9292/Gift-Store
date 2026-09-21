'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-8 text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#1C1917] mb-2">تم إرسال رسالتك بنجاح!</h3>
        <p className="text-sm text-[#78716C] mb-6">شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.</p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setFormData({ name: '', phone: '', message: '' })
          }}
          className="text-sm font-bold text-[#C9A96E] hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4DF] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <h2 className="text-2xl font-black text-[#1C1917] mb-6">أرسل لنا رسالة</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-bold text-[#1C1917] block mb-1.5">الاسم</label>
          <input
            type="text"
            required
            placeholder="اسمك الكامل"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#1C1917] block mb-1.5">رقم الهاتف</label>
          <input
            type="tel"
            required
            placeholder="07XX XXX XXXX"
            dir="ltr"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#1C1917] block mb-1.5">رسالتك</label>
          <textarea
            rows={5}
            required
            placeholder="اكتب رسالتك هنا..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
        >
          <Send className="w-4 h-4 rtl:-scale-x-100" />
          {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </button>
      </form>
    </div>
  )
}
