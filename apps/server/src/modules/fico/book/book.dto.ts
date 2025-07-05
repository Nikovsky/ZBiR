// @file: server/src/modules/fico/book/book.dto.ts
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { IsDate, IsEnum, IsOptional, IsString, IsBoolean } from "class-validator";
import { Type } from 'class-transformer'
import { FicoBookPanelSortFields, FicoBookPanelCreateDto, UserRegion, FicoBookPanelUpdateDto, FicoBookPanelApproveDto, FicoBookPanelDeleteDto } from "@zbir/types";

export class BookQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(FicoBookPanelSortFields) sortBy?: FicoBookPanelSortFields;
}

export class BookCreateDto implements FicoBookPanelCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(UserRegion) region: UserRegion;
  @IsDate() @Type(() => Date) openedAt: Date;
}

export class BookUpdateDto implements FicoBookPanelUpdateDto {
  @IsString() id: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(UserRegion) region?: UserRegion;
  @IsOptional() @IsDate() @Type(() => Date) openedAt?: Date;
  @IsOptional() @IsDate() @Type(() => Date) closedAt?: Date;
  @IsOptional() @IsBoolean() isClosed?: boolean;
}

export class BookApproveDto implements FicoBookPanelApproveDto {
  @IsString() id: string;
  @IsDate() @Type(() => Date) approvedAt: Date;
}

export class BookDeleteDto implements FicoBookPanelDeleteDto {
  @IsString() id: string;
}