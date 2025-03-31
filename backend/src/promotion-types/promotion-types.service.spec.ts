import { Test, TestingModule } from '@nestjs/testing';
import { PromotionTypesService } from './promotion-types.service';

describe('PromotionTypesService', () => {
  let service: PromotionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionTypesService],
    }).compile();

    service = module.get<PromotionTypesService>(PromotionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
