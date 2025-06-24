// @file: server/src/config/server.config.ts
import { registerAs } from '@nestjs/config';
import type { ServerConfig } from './server.type';

export default registerAs<ServerConfig>('server', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.NODE_PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  isProd: process.env.NODE_ENV === 'production',
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresInSec: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '15', 10) * 60,
    expiresInMs: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '15', 10) * 60_000,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresInSec: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '360', 10) * 60,
    expiresInMs: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '360', 10) * 60_000,
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '10000', 10),
    limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),
    blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MS || '60000', 10), // in milliseconds
  },
  emailVerificationTTL: {
    minutes: parseInt(process.env.EMAIL_CONFIRMATION_TTL || '15', 10),
    seconds: parseInt(process.env.EMAIL_CONFIRMATION_TTL || '15', 10) * 60,
    milliseconds: parseInt(process.env.EMAIL_CONFIRMATION_TTL || '15', 10) * 60_000,
  },
  payload: {
    header: {
      maxSizeBytes: parseInt(process.env.PAYLOAD_LIMIT_HEADER_KB || '8', 10) * 1024,
      maxSizeKb: parseInt(process.env.PAYLOAD_LIMIT_HEADER_KB || '8', 10),
    },
    body: {
      maxSize: process.env.PAYLOAD_LIMIT_BODY || '10mb',
      maxSizeBytes: parseInt(process.env.PAYLOAD_BODY_MAX_SIZE_BYTES || '10485760', 10),
      maxSizeKb: parseInt(process.env.PAYLOAD_BODY_MAX_SIZE_KB || '10240', 10),
    },
  }
}));
