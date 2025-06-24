// @file: server/src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common'
import { UserRole } from '@zbir/types'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
