// @file: server/src/modules/admin/user/user.dto.ts
import { UserRole, Gender, UserRegion, AdminPanelEditUserDto, AdminPanelEditPersonalDataDto, AdminPanelEditUserWithPersonalDataDto, AdminPanelCreateUserDto, AdminPanelUserSortFields, AdminPanelPasswordChangeDto } from '@zbir/types';
import { IsEmail, IsBoolean, IsOptional, IsString, MinLength, ValidateNested, IsUUID, IsDate, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationQueryDto } from '@/dto/pagination-query.dto'

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(AdminPanelUserSortFields) sortBy?: AdminPanelUserSortFields
}

export class CreateUserDto implements AdminPanelCreateUserDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() username?: string
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
  @IsEnum(UserRole) role: UserRole
  @IsOptional() @IsEnum(UserRegion) regionAccess?: UserRegion;
  @IsOptional() @IsBoolean() isActive?: boolean
  @IsOptional() @IsBoolean() isBlocked?: boolean
  @IsOptional() @IsBoolean() isEmailConfirmed?: boolean
  @IsOptional() @IsBoolean() twoFactorEnabled?: boolean
}

export class EditUserDto implements AdminPanelEditUserDto {
  @IsString() @IsUUID() id: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() username?: string;
  @IsEmail() email: string;
  @IsOptional() @Type(() => Date) @IsDate() emailVerified?: Date;
  @IsOptional() @IsString() image?: string;
  @IsBoolean() isActive: boolean;
  @IsBoolean() isBlocked: boolean;
  @IsBoolean() isEmailConfirmed: boolean;
  @IsBoolean() twoFactorEnabled: boolean;
  @IsEnum(UserRole) role: UserRole;
  @IsOptional() @IsEnum(UserRegion) regionAccess?: UserRegion;
}

export class EditPersonalDataDto implements AdminPanelEditPersonalDataDto {
  @IsString() @IsUUID() id: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() middleName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @Type(() => Date) @IsDate() birthDate?: Date;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsBoolean() canUserEdit: boolean;
}

export class EditUserWithPersonalDataDto extends EditUserDto implements AdminPanelEditUserWithPersonalDataDto {
  @IsOptional() @ValidateNested() @Type(() => EditPersonalDataDto) personalData?: EditPersonalDataDto;
}

export class PasswordChangeDto implements AdminPanelPasswordChangeDto {
  @IsString() @IsUUID() id: string;
  @IsString() @MinLength(8) newPassword: string;
}