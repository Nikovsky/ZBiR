import { Module } from '@nestjs/common';
import { CampService } from './camp.service';
import { CampController } from './camp.controller';

@Module({
  providers: [CampService],
  controllers: [CampController]
})
export class CampModule {}
