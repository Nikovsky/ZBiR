import { Test, TestingModule } from '@nestjs/testing';
import { CampController } from './camp.controller';

describe('CampController', () => {
  let controller: CampController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampController],
    }).compile();

    controller = module.get<CampController>(CampController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
