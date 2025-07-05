// @file: server/sec/modules/fico/page/page.dto.ts
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { FicoPagePanelSortFields, FicoPagePanelCreateDto, FicoEntryType, FicoEntryPanelCreateDto, FicoMoneyValue, FicoPagePanelDeleteDto, FicoCategoryPanelDeleteDto, FicoCategoryPanelCreateDto, FicoEntryPanelUpdateDto, FicoPagePanelUpdateDto, FicoCategoryPanelUpdateDto } from "@zbir/types";
import { IsEnum, IsOptional, IsString, ValidateIf, IsNotEmpty, IsNumber, IsDate } from "class-validator";
import { Type } from 'class-transformer'

export class PageQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(FicoPagePanelSortFields) sortBy?: FicoPagePanelSortFields;
}

export class PageCreateDto implements FicoPagePanelCreateDto {
  @IsString() ficoBookId: string;
  @IsString() name: string;
  @IsString() invoiceNumber: string;
  @Type(() => Date) @IsNotEmpty() timestamp: Date
  @IsEnum(FicoEntryType) type: FicoEntryType;
}

export class EntryCreateDto implements FicoEntryPanelCreateDto {
  @IsString() pageId: string;
  @IsString() ficoCategoryId: string;
  @ValidateIf((_, value) => value !== null) @IsNotEmpty() @IsOptional() @Type(() => Number) @IsNumber({}, { message: 'amount must be a number, numeric string or null' }) amount: FicoMoneyValue
}

export class CategoryCreateDto implements FicoCategoryPanelCreateDto {
  @IsString() ficoBookId: string;
  @IsString() name: string;
  @IsEnum(FicoEntryType) type: FicoEntryType;
}

export class CategoryUpdateDto implements FicoCategoryPanelUpdateDto {
  @IsString() id: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(FicoEntryType) type?: FicoEntryType;
}

export class PageUpdateDto implements FicoPagePanelUpdateDto {
  @IsString() id: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsOptional() @Type(() => Date) @IsDate() timestamp?: Date
  @IsOptional() @IsEnum(FicoEntryType) type?: FicoEntryType;
}

export class EntryUpdateDto implements FicoEntryPanelUpdateDto {
  @IsString() id: string;
  @IsOptional() @IsString() ficoCategoryId?: string;
  @ValidateIf((_, value) => value !== null) @IsNotEmpty() @IsOptional() @Type(() => Number) @IsNumber({}, { message: 'amount must be a number, numeric string or null' }) amount?: FicoMoneyValue
}

export class CategoryDeleteDto implements FicoCategoryPanelDeleteDto {
  @IsString() id: string;
}

export class PageDeleteDto implements FicoPagePanelDeleteDto {
  @IsString() id: string;
}