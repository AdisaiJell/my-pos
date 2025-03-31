import { Module } from '@nestjs/common';
import { PromotionTypesService } from './promotion-types.service';
import { PromotionTypesController } from './promotion-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionType } from './entities/promotion-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionType])],
  controllers: [PromotionTypesController],
  providers: [PromotionTypesService],
})
export class PromotionTypesModule {}
