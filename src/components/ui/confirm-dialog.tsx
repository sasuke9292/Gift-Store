'use client'

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, AlertCircle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20',
  },
  info: {
    icon: AlertCircle,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20',
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'تأكيد الحذف',
  cancelText = 'إلغاء',
  variant = 'danger',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] rounded-3xl p-0 overflow-hidden border border-[#E8E4DF] shadow-2xl bg-white"
        dir="rtl"
      >
        <div className="p-7">
          <div className={`w-14 h-14 rounded-2xl ${config.iconBg} flex items-center justify-center mb-5`}>
            <Icon className={`w-7 h-7 ${config.iconColor}`} />
          </div>
          <DialogTitle className="text-xl font-black text-[#1C1917] mb-2">
            {title}
          </DialogTitle>
          <p className="text-[#78716C] text-sm leading-relaxed">{description}</p>
          <div className="flex gap-3 mt-7">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-11 rounded-xl font-bold ${config.confirmClass} cursor-pointer`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري المعالجة...
                </span>
              ) : confirmText}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl font-bold border-[#E8E4DF] text-[#1C1917] hover:bg-[#FAFAF8] cursor-pointer"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
