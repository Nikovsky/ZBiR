// @file: server/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServerConfig } from './config/server.type';
import { DashboardModule } from './modules/user/dashboard/dashboard.module';
import { SessionModule } from './modules/admin/session/session.module';
import { UserModule } from './modules/admin/user/user.module';
import { CampModule } from './modules/camp/camp.module';
import serverConfig from './config/server.config';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig],
      cache: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'global',
            ttl: config.get<ServerConfig>('server').rateLimit.ttl,
            limit: config.get<ServerConfig>('server').rateLimit.limit,
            blockDuration: config.get<ServerConfig>('server').rateLimit.blockDuration,
          },
        ],
      }),
      inject: [ConfigService],
    }),
    DashboardModule,
    SessionModule,
    UserModule,
    CampModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
