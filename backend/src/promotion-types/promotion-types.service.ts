import { Injectable } from '@nestjs/common';
import { CreatePromotionTypeDto } from './dto/create-promotion-type.dto';
import { UpdatePromotionTypeDto } from './dto/update-promotion-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionType } from './entities/promotion-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionTypesService {
  constructor(
    @InjectRepository(PromotionType)
    private promotionTypesRepository: Repository<PromotionType>,
  ) {}
  create(createPromotionTypeDto: CreatePromotionTypeDto) {
    return 'This action adds a new promotionType';
  }

  findAll() {
    return this.promotionTypesRepository.find({
      relations: { promotions: true },
    });
  }

  findOne(id: number) {
    return this.promotionTypesRepository.findOneByOrFail({ id });
  }

  update(id: number, updatePromotionTypeDto: UpdatePromotionTypeDto) {
    return `This action updates a #${id} promotionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotionType`;
  }
}
