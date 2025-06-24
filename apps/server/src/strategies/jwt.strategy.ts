// @file: server/src/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { ServerConfig } from '@/config/server.type'

type JwtPayload = {
  sub: string
  email: string
  role: string
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['access_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<ServerConfig>('server').accessToken.secret,
    })
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    }
  }
}