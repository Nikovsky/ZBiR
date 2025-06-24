// @file: server/src/config/server.type.ts
export type ServerConfig = {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  isProd: boolean;
  accessToken: {
    secret: string;
    expiresInSec: number;
    expiresInMs: number;
  },
  refreshToken: {
    secret: string;
    expiresInSec: number;
    expiresInMs: number;
  },
  rateLimit: {
    ttl: number;
    limit: number;
    blockDuration: number;
  },
  emailVerificationTTL: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  },
  payload: {
    header: {
      maxSizeBytes: number;
      maxSizeKb: number;
    }
    body: {
      maxSize: string;
      maxSizeBytes: number;
      maxSizeKb: number;
    }
  }
}