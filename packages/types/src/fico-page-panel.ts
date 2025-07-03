// @file: packages/types/src/fico-page-panel.ts
import { FicoMoneyValue } from "./fico-book-panel";
export enum FicoEntryType { INCOME = 'INCOME', EXPENSE = 'EXPENSE' }

// SERVER >>> CLIENT --- READ
export interface FicoCategoryPanelDto {
  id: string
  name: string
  type: FicoEntryType
}

export interface FicoPagePanelDto {
  id: string
  name: string
  invoiceNumber: string
  timestamp: Date
  type: FicoEntryType
  value: FicoMoneyValue
}

export interface FicoEntryPanelDto {
  id: string
  ficoCategoryId: string
  amount: FicoMoneyValue
}

export interface FicoPageWithEntriesPanelDto extends FicoPagePanelDto {
  entries: FicoEntryPanelDto[]
}

// CLIENT >>> SERVER --- CREATE
export interface FicoCategoryPanelCreateDto {
  ficoBookId: string
  name: string
  type: FicoEntryType
}

export interface FicoPagePanelCreateDto {
  ficoBookId: string
  name: string
  invoiceNumber: string
  timestamp: Date
  type: FicoEntryType
}

export interface FicoEntryPanelCreateDto {
  pageId: string
  ficoCategoryId: string
  amount: FicoMoneyValue
}

// CLIENT >>> SERVER --- UPDATE
export interface FicoCategoryPanelUpdateDto {
  id: string
  name?: string
  type?: FicoEntryType
}

export interface FicoPagePanelUpdateDto {
  id: string
  name?: string
  invoiceNumber?: string
  timestamp?: Date
  type?: FicoEntryType
}

export interface FicoEntryPanelUpdateDto {
  id: string
  ficoCategoryId?: string
  amount?: FicoMoneyValue
}

// CLIENT >>> SERVER --- DELETE
export interface FicoCategoryPanelDeleteDto {
  id: string
}

export interface FicoPagePanelDeleteDto {
  id: string
}

// PAGINATION - SORT FIELDS
export enum FicoPagePanelSortFields { TIMESTAMP = 'timestamp' }