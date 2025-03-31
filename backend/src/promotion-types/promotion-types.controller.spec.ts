import { Test, TestingModule } from '@nestjs/testing';
import { PromotionTypesController } from './promotion-types.controller';
import { PromotionTypesService } from './promotion-types.service';

describe('PromotionTypesController', () => {
  let controller: PromotionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionTypesController],
      providers: [PromotionTypesService],
    }).compile();

    controller = module.get<PromotionTypesController>(PromotionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
