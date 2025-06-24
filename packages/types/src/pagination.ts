// @file: packages/types/src/pagination.ts
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PaginationQuery<T extends string = string> {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: T;
  sortDirection?: SortDirection;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const DEFAULT_PAGINATION_LIMIT = 10;
export const ALLOWED_PAGINATION_LIMITS = [1, 10, 25, 50, 100] as const;
export type AllowedPaginationLimits = (typeof ALLOWED_PAGINATION_LIMITS)[number];