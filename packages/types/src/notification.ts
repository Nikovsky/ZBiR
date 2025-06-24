// @file: packages/types/src/notification.ts
export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export interface NotificationData {
  id?: string
  type: NotificationType
  message: string
  duration?: number // in seconds; 0 = persistent
}