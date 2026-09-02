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
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20',
  },
  info: {
    icon: AlertCircle,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20',
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '?????',
  cancelText = '?????',
  variant = 'danger',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl"
        dir="rtl"
      >
        <div className="p-8 bg-white">
          <div className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mb-6`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <DialogTitle className="text-xl font-black text-slate-800 mb-2">
            {title}
          </DialogTitle>
          <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
          <div className="flex gap-3 mt-8">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-12 rounded-xl font-bold ${config.confirmClass}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ???? ???????...
                </span>
              ) : confirmText}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
