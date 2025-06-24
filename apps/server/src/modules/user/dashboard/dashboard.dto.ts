// @file: server/src/modules/user/dashboard/dashboard.dto.ts
import { IsOptional, IsString, IsEnum, IsDateString, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Gender } from '@prisma/client'

export class UpdatePersonalDataDto {
  @IsOptional() @IsString() firstName?: string | null
  @IsOptional() @IsString() middleName?: string | null
  @IsOptional() @IsString() lastName?: string | null
  @IsOptional() @IsString() phoneNumber?: string | null
  @IsOptional() @IsString() address?: string | null
  @IsOptional() @IsString() city?: string | null
  @IsOptional() @IsString() zipCode?: string | null
  @IsOptional() @IsString() country?: string | null
  @IsOptional() @IsDateString() birthDate?: string | null
  @IsOptional() @IsEnum(Gender) gender?: Gender | null
}

export class UpdateUserDashboardDto {
  @IsOptional() @IsString() username?: string | null
  @IsOptional() @IsString() name?: string | null

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonalDataDto)
  personalData?: UpdatePersonalDataDto
}

export class ChangePasswordDto {
  @IsString() currentPassword: string
  @IsString() @MinLength(8) newPassword: string
}