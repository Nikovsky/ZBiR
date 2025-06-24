// @file: server/src/dto/pagination-query.dto.ts
import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortDirection } from '@zbir/types';

export class PaginationQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn(['asc', 'desc']) sortDirection?: SortDirection;
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number;
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) limit?: number;
}