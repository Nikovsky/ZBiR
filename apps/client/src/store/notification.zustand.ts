// @file: client/src/store/notification.zustand.ts
import { create } from 'zustand'
import { NotificationType } from '@zbir/types'

type NotificationState = {
  notification: {
    id: string
    message: string
    type: NotificationType
    duration: number
  } | null
  notify: (message: string, type: NotificationType, duration?: number) => void
  hide: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  notify: (message, type, duration = 3) =>
    set({
      notification: {
        id: `${Date.now()}`,
        message,
        type,
        duration,
      },
    }),
  hide: () => set({ notification: null }),
}))

// Shortcut helpers
export const notify = {
  success: (msg: string, duration?: number) =>
    useNotificationStore.getState().notify(msg, NotificationType.SUCCESS, duration),
  error: (msg: string, duration?: number) =>
    useNotificationStore.getState().notify(msg, NotificationType.ERROR, duration),
  warning: (msg: string, duration?: number) =>
    useNotificationStore.getState().notify(msg, NotificationType.WARNING, duration),
  info: (msg: string, duration?: number) =>
    useNotificationStore.getState().notify(msg, NotificationType.INFO, duration),
}
