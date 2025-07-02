// @file: server/src/interfaces/jwt.request.user.interface.ts
import { UserRegion } from '@prisma/client'
import { UserRole } from '@zbir/types'

export interface JwtRequestUser {
  id: string
  email: string
  role: UserRole
  regionAccess: UserRegion
  exp: number
  iat: number
}