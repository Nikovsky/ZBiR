// @file: server/src/modules/auth/auth.service.ts
import { Injectable, ConflictException, Logger, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zbir/database';
import { RegisterDto, LoginDto } from './auth.dto';
import { ConfigService } from '@nestjs/config'
import { ServerConfig } from '@/config/server.type';
import { JwtService } from '@nestjs/jwt'
import { AuthResponse } from '@/interfaces/auth.interface';
import { Request, Response } from 'express';
import { UserRegion, UserRole } from '@prisma/client';
import { v4 as uuid } from 'uuid'
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (userExists) { throw new ConflictException('User with this email already exists.') }
    const hashed = await argon2.hash(dto.password)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        personalData: {
          create: {},
        },
      },
    })
    await this.sendEmailVerificationCode(user.email)
    return { message: `Wysłano kod na ${dto.email}` }
  }

  async login(dto: LoginDto, req: Request): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        isEmailConfirmed: true
      },
    })

    if (!user) { throw new UnauthorizedException('Invalid credentials or email not verified') }

    const isMatch = await argon2.verify(user.password, dto.password)
    if (!isMatch) { throw new UnauthorizedException('Invalid credentials') }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    return this.generateTokensAndSession(user.id, user.email, user.role, user.regionAccess, req)
  }

  private async generateTokensAndSession(
    userId: string,
    email: string,
    role: UserRole,
    regionAccess: UserRegion,
    req: Request,
  ): Promise<AuthResponse> {
    const sessionId = uuid()

    const accessToken = await this.jwt.signAsync(
      { sub: userId, email, role, regionAccess, sid: sessionId },
      {
        secret: this.config.get<ServerConfig>('server').accessToken.secret,
        expiresIn: this.config.get<ServerConfig>('server').accessToken.expiresInSec,
      },
    )

    const refreshToken = await this.jwt.signAsync(
      { sub: userId, sid: sessionId },
      {
        secret: this.config.get<ServerConfig>('server').refreshToken.secret,
        expiresIn: this.config.get<ServerConfig>('server').refreshToken.expiresInSec,

      },
    )

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const userAgent = req.headers['user-agent'] || 'unknown'

    await this.prisma.session.create({
      data: {
        id: sessionId,
        sessionToken: refreshToken,
        userId,
        expires: new Date(Date.now() + this.config.get<ServerConfig>('server').accessToken.expiresInMs),
        ip: typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : 'unknown',
        deviceInfo: userAgent,
      },
    })

    return {
      user: { id: userId, email, regionAccess, role },
      tokens: { accessToken, refreshToken },
    }
  }

  setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      maxAge: this.config.get<ServerConfig>('server').accessToken.expiresInMs,
      sameSite: 'lax',
      secure: this.config.get<ServerConfig>('server').isProd,
    })
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.config.get<ServerConfig>('server').refreshToken.expiresInMs,
      sameSite: 'lax',
      secure: this.config.get<ServerConfig>('server').isProd,
    })
  }

  async clearAuthCookies(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      path: '/',
    }

    res.clearCookie('access_token', cookieOptions)
    res.clearCookie('refresh_token', cookieOptions)
  }

  async logout(req: Request, res: Response): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refresh_token

    if (refreshToken) {
      try {
        const payload = this.jwt.decode(refreshToken) as { sid: string }
        if (payload?.sid) {
          await this.prisma.session.delete({
            where: { id: payload.sid },
          })
        }
      } catch (err) {
        // log optionally or ignore
      }
    }

    this.clearAuthCookies(res)
    return { message: 'Logout successful' }
  }

  async refreshSession(req: Request): Promise<AuthResponse> {
    const refreshToken = req.cookies?.refresh_token
    if (!refreshToken) throw new UnauthorizedException('No refresh token')

    // weryfikacja JWT
    let payload: any
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<ServerConfig>('server').refreshToken.secret,
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }

    // pobranie sesji z DB
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
      include: { user: true },
    })

    if (!session || session.expires.getTime() < Date.now())
      throw new UnauthorizedException('Session expired or not found')

    // opcjonalne odświeżenie expires (strategia sliding window)
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        expires: new Date(Date.now() + this.config.get<ServerConfig>('server').accessToken.expiresInMs),
      },
    })

    // generuj nowe tokeny
    const accessToken = await this.jwt.signAsync(
      {
        sub: session.user.id,
        email: session.user.email,
        role: session.user.role,
        sid: session.id,
      },
      {
        secret: this.config.get<ServerConfig>('server').accessToken.secret,
        expiresIn: this.config.get<ServerConfig>('server').accessToken.expiresInSec,
      },
    )

    const newRefreshToken = await this.jwt.signAsync(
      { sub: session.user.id, sid: session.id },
      {
        secret: this.config.get<ServerConfig>('server').refreshToken.secret,
        expiresIn: this.config.get<ServerConfig>('server').refreshToken.expiresInSec,
      },
    )

    // aktualizacja sessionToken
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: newRefreshToken,
      },
    })

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        regionAccess: session.user.regionAccess
      },
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    }
  }


  async sendEmailVerificationCode(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('User not found')

    const token = uuid()
    const expiresAt = new Date(Date.now() + this.config.get<ServerConfig>('server').emailVerificationTTL.milliseconds)

    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: 'EMAIL_CONFIRMATION',
        expires: expiresAt,
      },
    })

    Logger.debug(`${email} >>> ${this.config.get<ServerConfig>('server').clientUrl}/verify-email?token=${token}`, 'EMAIL CODE')
    // TODO: Send email with code via email service
  }

  async verifyEmailToken(token: string): Promise<void> {
    const tokenEntry = await this.prisma.verificationToken.findFirst({
      where: {
        token,
        type: 'EMAIL_CONFIRMATION',
        expires: { gte: new Date() },
      },
      include: { user: true },
    })

    if (!tokenEntry) throw new BadRequestException('Invalid or expired token')

    await this.prisma.user.update({
      where: { id: tokenEntry.userId },
      data: {
        isEmailConfirmed: true,
        emailVerified: new Date(),
      },
    })

    await this.prisma.verificationToken.delete({
      where: { id: tokenEntry.id },
    })
  }

}
