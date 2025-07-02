// @file: server/src/interfaces/auth.interface.ts
import { UserRegion, UserRole } from '@prisma/client'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}
export interface AuthResponse {
  user: {
    id: string
    email: string
    role: UserRole
    regionAccess: UserRegion
  }
  tokens: TokenPair
}