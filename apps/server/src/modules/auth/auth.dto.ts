// @file: server/src/modules/auth/auth.dto.ts
import { IsEmail, IsString, MinLength, IsUUID } from 'class-validator'

export class RegisterDto {
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
}

export class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
}

export class SendEmailVerificationDto {
  @IsEmail() email: string
}

export class VerifyEmailTokenDto {
  @IsUUID() token: string
}