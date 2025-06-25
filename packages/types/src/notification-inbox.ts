// @file: packages/types/src/notification-inbox.ts

export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SYSTEM = "SYSTEM",
  INVITATION = "INVITATION",
}

export enum NotificationImportance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// SERVER >>> CLIENT --- GET
export interface InboxNotificationDto {
  id: string
  type: NotificationType
  importance: NotificationImportance
  topic: string
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  userToCampId?: string | null
  createdBy?: {
    id: string
    name?: string | null
    email: string
  } | string | null
}

// CLIENT >>> SERVER --- POST/PATCH/PUT/DELETE
export interface SendNotificationDto {
  userId: string
  type: NotificationType
  importance?: NotificationImportance
  topic: string
  content: string
  userToCampId?: string
}

export interface MarkNotificationReadDto {
  id: string
  isRead: boolean
}