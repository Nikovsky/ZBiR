// @file: packages/types/src/admin-session.ts
import { UserRole } from "./user";

export interface GroupedUserSession {
  userId: string;
  email: string;
  role: UserRole;
  sessionCount: number;
  activeSessionCount: number;
}

export interface UserSession {
  id: string;
  userId: string;
  ip: string | null;
  deviceInfo: string | null;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  user: {
    email: string;
  };
}

export enum GroupedUserSessionSortBy {
  EMAIL = 'email',
  ROLE = 'role',
  SESSION_COUNT = 'sessionCount',
  ACTIVE_SESSION_COUNT = 'activeSessionCount'
}

export enum UserSessionSortBy {
  IP = 'ip',
  DEVICE_INFO = 'deviceInfo',
  CREATED_AT = 'createdAt',
  EXPIRES = 'expires'
}