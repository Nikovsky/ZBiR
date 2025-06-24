// @file: packages/types/src/user-dashboard.ts
import { Gender, UserRole } from './user'

export interface PublicPersonalData {
  firstName: string | null
  middleName: string | null
  lastName: string | null
  phoneNumber: string | null
  address: string | null
  city: string | null
  zipCode: string | null
  country: string | null
  birthDate: Date | null
  gender: Gender | null
}

export interface PublicAccountData {
  id: string
  email: string
  username: string | null
  name: string | null
  image: string | null
  role: UserRole
  lastLoginAt: Date | null
}


export interface PublicUserAccountDto extends PublicAccountData {
  personalData: PublicPersonalData | null
}

export interface UpdatePersonalDataDto {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  address?: string | null
  city?: string | null
  zipCode?: string | null
  country?: string | null
  birthDate?: string | null // Uwaga: string w formacie ISO yyyy-MM-dd
  gender?: Gender | null
}

export interface UpdateUserAccountDto {
  username?: string | null
  name?: string | null
  personalData?: UpdatePersonalDataDto
}