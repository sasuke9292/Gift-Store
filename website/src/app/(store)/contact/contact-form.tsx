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
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center py-12 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">تم إرسال رسالتك بنجاح!</h3>
        <p className="text-sm text-slate-500 mb-6">شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.</p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setFormData({ name: '', phone: '', message: '' })
          }}
          className="text-sm font-bold text-[#13213c] hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <h2 className="text-2xl font-black text-slate-900 mb-6">أرسل لنا رسالة</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-1.5">الاسم</label>
          <input
            type="text"
            required
            placeholder="اسمك الكامل"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#13213c]/50 focus:ring-2 focus:ring-[#13213c]/15 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-1.5">رقم الهاتف</label>
          <input
            type="tel"
            required
            placeholder="07XX XXX XXXX"
            dir="ltr"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#13213c]/50 focus:ring-2 focus:ring-[#13213c]/15 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-1.5">رسالتك</label>
          <textarea
            rows={5}
            required
            placeholder="اكتب رسالتك هنا..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#13213c]/50 focus:ring-2 focus:ring-[#13213c]/15 transition-all resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 shadow-md shadow-[#13213c]/20 hover:shadow-lg hover:shadow-[#13213c]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
        >
          <Send className="w-4 h-4 rtl:-scale-x-100" />
          {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </button>
      </form>
    </div>
  )
}
