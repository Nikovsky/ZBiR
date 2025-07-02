// @file: packages/types/src/camp-panel.ts
import { UserRegion } from "./user"

// SERVER >>> CLIENT --- GET
export interface CampPanelDto {
  id: string
  name: string
  year: number
  region: UserRegion
  isClosed: boolean
  approvedAt: Date | null
  incomeSum: number | string
  expenseSum: number | string
  balanceFinal: number | string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface CampPanelExtendedDto extends CampPanelDto {
  ownerName: string | null
  ownerEmail: string
  participantsCount: number
  pendingParticipantsCount: number
  ficoEntryCount: number
}

export interface CampPanelParticipantDto {
  id: string
  campId: string
  userId: string
  accepted: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    email: string
    name?: string | null
  }
}

// PAGINATION - SORT FIELDS
export enum CampPanelSortFields {
  NAME = 'name',
  YEAR = 'year',
  REGION = 'region',
  IS_CLOSED = 'isClosed',
  APPROVED_AT = 'approvedAt',
  INCOME_SUM = 'incomeSum',
  EXPENSE_SUM = 'expenseSum',
  BALANCE_FINAL = 'balanceFinal',
  OWNER_ID = 'ownerId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

// CLIENT >>> SERVER --- POST/PATCH/PUT/DELETE
export interface CampPanelCreateDto {
  name: string
  year: number
  region: UserRegion
  ownerId: string
}

export interface CampPanelEditDto {
  id: string
  name: string
  year: number
  region: UserRegion
  isClosed: boolean
  approvedAt: Date | null
  ownerId: string
}

export interface CampParticipantAddDto {
  campId: string
  userId: string
}

export interface CampParticipantAcceptDto {
  userToCampId: string
}

export interface CampParticipantRemoveDto {
  userToCampId: string
  campId: string
  userId: string
}