// @file: packages/types/src/admin-user.ts
import { UserRole, Gender } from './user';

// SERVER >>> CLIENT --- GET
export interface AdminPanelUserDto {
  id: string
  name: string | null
  username: string | null
  email: string
  emailVerified: Date | null
  isActive: boolean
  isBlocked: boolean
  isEmailConfirmed: boolean
  twoFactorEnabled: boolean
  failedLoginAttempts: number
  lastLoginAt: Date | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface AdminPanelPersonalDataDto {
  id: string
  userId: string
  firstName?: string
  middleName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  birthDate?: Date
  gender?: Gender
  canUserEdit: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AdminPanelUserWithPersonalDataDto extends AdminPanelUserDto {
  personalData: AdminPanelPersonalDataDto | null
}

// PAGINATION - SORT FIELDS
export enum AdminPanelUserSortFields {
  NAME = 'name',
  USERNAME = 'username',
  EMAIL = 'email',
  EMAIL_VERIFIED = 'emailVerified',
  ROLE = 'role',
  LAST_LOGIN = 'lastLoginAt',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  IS_ACTIVE = 'isActive',
  IS_BLOCKED = 'isBlocked'
}

// CLIENT >>> SERVER --- POST/PATCH/PUT/DELETE
export interface AdminPanelCreateUserDto {
  name?: string
  username?: string
  email: string
  password: string
  role: UserRole
  isActive?: boolean
  isBlocked?: boolean
  isEmailConfirmed?: boolean
  twoFactorEnabled?: boolean
}

export interface AdminPanelEditUserDto {
  id: string
  name?: string
  username?: string
  email: string
  emailVerified?: Date
  image?: string
  isActive?: boolean
  isBlocked?: boolean
  isEmailConfirmed?: boolean
  twoFactorEnabled?: boolean
  role: UserRole
}

export interface AdminPanelEditPersonalDataDto {
  id: string
  firstName?: string
  middleName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  birthDate?: Date
  gender?: Gender
  canUserEdit: boolean
}

export interface AdminPanelEditUserWithPersonalDataDto extends AdminPanelEditUserDto {
  personalData?: AdminPanelEditPersonalDataDto
}

export interface AdminPanelPasswordChangeDto {
  id: string
  email: string
  currentPassword: string
  newPassword: string
}

export interface AdminPanelDeleteUserDto {
  id: string
}
