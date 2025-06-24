// @file: server/src/modules/auth/auth.controller.ts
import { Controller, Get, Post, Body, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, SendEmailVerificationDto, VerifyEmailTokenDto } from './auth.dto';
import { Request, Response } from 'express';
import { AuthResponse } from '@/interfaces/auth.interface';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface';
import { SessionResponse } from '@zbir/types';

// Extend Express Request interface to include 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtRequestUser;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto
  ): Promise<{ message: string }> {
    return await this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.login(dto, req)
    this.authService.setAuthCookies(res, result.tokens)
    return result
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSession(@Req() req: Request): Promise<SessionResponse> {
    const user = req.user as JwtRequestUser
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: user.exp,
      iat: user.iat
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    return await this.authService.logout(req, res)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const result = await this.authService.refreshSession(req)
    this.authService.setAuthCookies(res, result.tokens)
    return result
  }

  @Post('send-verification-code')
  @HttpCode(HttpStatus.OK)
  async sendEmailVerification(
    @Body() dto: SendEmailVerificationDto,
  ): Promise<void> {
    return this.authService.sendEmailVerificationCode(dto.email)
  }

  @Post('verify-email-code')
  @HttpCode(HttpStatus.OK)
  async verifyEmailCode(@Body() dto: VerifyEmailTokenDto): Promise<void> {
    return this.authService.verifyEmailToken(dto.token)
  }
}
