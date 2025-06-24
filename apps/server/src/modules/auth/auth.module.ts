// @file: server/src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { JwtStrategy } from '@/strategies/jwt.strategy'
import { PrismaModule } from '@/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [JwtModule.register({}), PrismaModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ]
})
export class AuthModule { }
