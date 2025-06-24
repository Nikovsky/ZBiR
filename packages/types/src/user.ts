// @file: packages/types/src/user.ts
export enum UserRole {
  ROOT = 'ROOT',
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface SessionResponse {
  id: string
  email: string
  role: UserRole
  exp: number // expiry timestamp (z tokena)
  iat: number // issued at
}