// @file: server/src/modules/admin/session/session.dto.ts
import { IsEnum, IsOptional } from 'class-validator'
import { PaginationQueryDto } from '@/dto/pagination-query.dto'
import { GroupedUserSessionSortBy, UserSessionSortBy } from '@zbir/types'

export class GroupedSessionQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(GroupedUserSessionSortBy) sortBy?: GroupedUserSessionSortBy
}

export class UserSessionQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(UserSessionSortBy) sortBy?: UserSessionSortBy
}