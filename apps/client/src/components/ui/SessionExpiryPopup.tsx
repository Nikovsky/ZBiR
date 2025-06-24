// @file: client/src/components/ui/SessionExpiryPopup.tsx
'use client'

import { useEffect } from 'react'
import { useSessionStore } from '@/store/session.zustand'

type Props = {
  onExtend: () => void
  onLogout: () => void
}

export const SessionExpiryPopup = ({ onExtend, onLogout }: Props) => {
  const { expiresAt, countdown, setCountdown, visible } = useSessionStore()

  useEffect(() => {
    if (!visible || !expiresAt) return

    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setCountdown(secondsLeft)
      if (secondsLeft <= 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [visible, expiresAt])

  if (!visible || !expiresAt) return null

  return (
    <div className="fixed top-13 right-2 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 p-4 rounded-xl w-60">
      <p className="text-sm text-gray-800 dark:text-white mb-2">
        Twoja sesja wygaśnie za <strong>{Math.floor(countdown / 60)}m {countdown % 60}s</strong>
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onLogout}
          className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100"
        >
          Wyloguj
        </button>
        <button
          onClick={onExtend}
          className="text-sm px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          Przedłuż sesję
        </button>
      </div>
    </div>
  )
}
