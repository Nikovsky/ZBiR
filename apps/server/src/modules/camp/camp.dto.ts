// @file: apps/server/src/modules/camp/camp.dto.ts
import { IsString, IsNumber, MinLength, IsUUID, IsBoolean, IsEnum, IsOptional, IsDate } from 'class-validator';
import { CampPanelCreateDto, CampPanelEditDto, CampParticipantAcceptDto, CampParticipantAddDto, UserRegion, CampPanelSortFields } from '@zbir/types';
import { PaginationQueryDto } from '@/dto/pagination-query.dto';

export class CampQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(CampPanelSortFields) sortBy?: CampPanelSortFields;
}

export class CreateCampDto implements CampPanelCreateDto  {
  @IsString() @MinLength(2) name: string;
  @IsNumber() year: number;
  @IsEnum(UserRegion) region: UserRegion;
  @IsString() @IsUUID() ownerId: string; 
}

export class EditCampDto implements CampPanelEditDto {
  @IsString() @IsUUID() id: string;
  @IsString() @MinLength(2) name: string;
  @IsNumber() year: number;
  @IsEnum(UserRegion) region: UserRegion;
  @IsBoolean() isClosed: boolean;
  @IsDate() @IsOptional() approvedAt: Date | null;
  @IsString() @IsUUID() ownerId: string;
}

export class AddCampParticipantDto implements CampParticipantAddDto {
  @IsString() @IsUUID() campId: string;
  @IsString() @IsUUID() userId: string;
}

export class AcceptCampParticipantDto implements CampParticipantAcceptDto {
  @IsString() @IsUUID() userToCampId: string;
}

export class CampParticipantRemoveDto {
  @IsString() @IsUUID() userToCampId: string;
  @IsString() @IsUUID() campId: string;
  @IsString() @IsUUID() userId: string;
}
