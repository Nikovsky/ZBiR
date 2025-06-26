// @file: packages/types/src/notification-inbox.ts

export enum InboxNotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SYSTEM = "SYSTEM",
  INVITATION = "INVITATION",
}

export enum InboxNotificationImportance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// SERVER >>> CLIENT --- GET
export interface InboxNotificationDto {
  id: string
  type: InboxNotificationType
  importance: InboxNotificationImportance
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
export interface SendInboxNotificationDto {
  userId: string
  type: InboxNotificationType
  importance?: InboxNotificationImportance
  topic: string
  content: string
  userToCampId?: string
}

export interface MarkInboxNotificationReadDto {
  id: string
  isRead: boolean
}