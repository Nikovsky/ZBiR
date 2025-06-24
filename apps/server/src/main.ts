// @file: server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './config/server.type';
import { ValidationPipe, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const serverConfig = configService.get<ServerConfig>('server');
  if (!serverConfig) throw new Error('Server configuration not found');

  app.enableShutdownHooks();

  // PAYLOAD LIMITS
  if (!serverConfig.isProd) {
    app.use((req, res, next) => {
      // LOG BODY SIZE
      let bodySize = 0;
      req.on('data', chunk => { bodySize += chunk.length; });
      req.on('end', () => {
        if (bodySize > 10) { Logger.debug(`Incoming body size: ${bodySize}B`, 'RequestSize'); }
        if (bodySize > 10_000) { Logger.warn(`Large request body: ${bodySize}B`, 'RequestSize'); }
      });

      // VALIDATE HEADER SIZE
      const totalHeaderSize = Object.entries(req.headers).reduce((acc, [key, val]) => {
        const headerVal = Array.isArray(val) ? val.join(',') : val ?? '';
        return acc + Buffer.byteLength(key + headerVal, 'utf8');
      }, 0);

      if (totalHeaderSize > serverConfig.payload.header.maxSizeBytes) {
        Logger.warn(`Blocked request: header size = ${totalHeaderSize}B (limit ${serverConfig.payload.header.maxSizeBytes}B)`, 'HeaderLimit');
        return res.status(431).json({ error: 'Request header too large' });
      }
      next();
    });
  }
  Logger.debug(`Header size limit: ${serverConfig.payload.header.maxSizeKb}kb`, 'HeaderLimit');

  app.use(json({ limit: serverConfig.payload.body.maxSize }));
  app.use(urlencoded({ limit: serverConfig.payload.body.maxSize, extended: true }));
  Logger.debug(`Body size limit: ${serverConfig.payload.body.maxSize}`, 'BodyLimit');

  // TRUST PROXY
  app.set('trust proxy', 1);
  Logger.log('ENABLED', 'TrustProxy');

  // HELMET SECURITY MIDDLEWARE
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        "font-src": ["'self'", "fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    noSniff: true,
    hsts: serverConfig.isProd
      ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      }
      : false,
  }));
  Logger.log('ENABLED', 'Helmet');

  // COOKIE PARSER
  app.use(cookieParser());
  Logger.log('ENABLED', 'CookieParser');

  // CORS
  app.enableCors({
    origin: serverConfig.clientUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  Logger.log('ENABLED: [GET,HEAD,PUT,PATCH,POST,DELETE]', 'CORS');

  // VALIDATION PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  Logger.log('ENABLED', 'ValidationPipe');

  // SERVER START
  await app.listen(serverConfig.port ?? 5000);
  Logger.debug(`Server is running on ${await app.getUrl()}`, `MODE:${serverConfig.isProd ? 'PROD' : 'DEVELOPMENT'}`);
  Logger.debug(`Client is running on ${serverConfig.clientUrl}`, 'CLIENT_URL');
}
bootstrap();
