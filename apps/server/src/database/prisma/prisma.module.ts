// @file: server/src/database/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@zbir/database';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }