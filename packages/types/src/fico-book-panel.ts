// @file: packages/types/src/fico-book-panel.ts
import { UserRegion } from './user'
export type FicoMoneyValue = number | string | null

// SERVER >>> CLIENT --- READ
export interface FicoBookPanelDto {
  id: string
  name: string
  description?: string
  region: UserRegion
  openedAt: Date
  closedAt?: Date
  approvedAt?: Date
  isClosed: boolean
  incomeSum: FicoMoneyValue
  expenseSum: FicoMoneyValue
  balanceSum: FicoMoneyValue
}

export interface FicoBookPanelWithOwnerDto extends FicoBookPanelDto {
  owner: {
    id: string
    name?: string | null
    email: string
  }
}

// CLIENT >>> SERVER --- CREATE
export interface FicoBookPanelCreateDto {
  name: string
  description?: string
  region: UserRegion
  openedAt: Date
}

// CLIENT >>> SERVER --- UPDATE
export interface FicoBookPanelUpdateDto {
  id: string
  name?: string
  description?: string
  region?: UserRegion
  openedAt?: Date
  closedAt?: Date
  isClosed?: boolean
}

export interface FicoBookPanelApproveDto {
  id: string
  approvedAt: Date
}

// CLIENT >>> SERVER --- DELETE
export interface FicoBookPanelDeleteDto {
  id: string
}

// PAGINATION - SORT FIELDS
export enum FicoBookPanelSortFields {
  NAME = 'name',
  DESCRIPTION = 'description',
  REGION = 'region',
  OPENED_AT = 'openedAt',
  CLOSED_AT = 'closedAt',
  APPROVED_AT = 'approvedAt',
  IS_CLOSED = 'isClosed',
  INCOME_SUM = 'incomeSum',
  EXPENSE_SUM = 'expenseSum',
  BALANCE_SUM = 'balanceSum',
}