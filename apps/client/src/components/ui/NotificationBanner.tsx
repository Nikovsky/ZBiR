// @file: client/src/components/ui/NotificationBanner.tsx
'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notification.zustand'
import { NotificationType } from '@zbir/types'
import { CheckCircle, XCircle, ExclamationTriangle, Info } from 'react-bootstrap-icons'
import clsx from 'clsx'

export default function NotificationBanner() {
  const { notification, hide } = useNotificationStore()

  useEffect(() => {
    if (notification?.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        hide()
      }, notification.duration * 1000)
      return () => clearTimeout(timer)
    }
  }, [notification?.id])


  if (!notification) return null

  const styleMap = {
    [NotificationType.SUCCESS]: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    [NotificationType.ERROR]: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    [NotificationType.WARNING]: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: <ExclamationTriangle className="w-5 h-5 text-yellow-600" />,
    },
    [NotificationType.INFO]: {
      bg: 'bg-cyan-100',
      border: 'border-cyan-400',
      text: 'text-cyan-800',
      icon: <Info className="w-5 h-5 text-cyan-600" />,
    },
  }

  const styles = styleMap[notification.type]

  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-4">
      <div
        className={clsx(
          'mx-auto w-full max-w-screen-xl px-6 py-3 flex items-center justify-between gap-3 rounded shadow opacity-90',
          styles.bg,
          styles.border,
          styles.text,
          'border',
        )}
      >
        <div className="flex items-center gap-3">
          {styles.icon}
          <span className="text-sm">{notification.message}</span>
        </div>
        <button onClick={hide} className="text-xl font-bold leading-none hover:opacity-70">×</button>
      </div>
    </div>
  )
}
