import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion) private promoRepository: Repository<Promotion>,
  ) {}
  create(createPromotionDto: CreatePromotionDto) {
    if (createPromotionDto.promotionType.name !== 'ส่วนลด') {
      createPromotionDto.discount = 0;
    }
    return this.promoRepository.save(createPromotionDto);
  }

  findAll() {
    return this.promoRepository.find({
      relations: { promoProducts: true, promotionType: true },
    });
  }

  findOne(id: number) {
    return this.promoRepository.findOneOrFail({
      where: { id },
      relations: { promoProducts: true, promotionType: true },
    });
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    const updatePromotion = await this.promoRepository.findOneByOrFail({ id });
    const updatedPromotion = { ...updatePromotion, ...updatePromotionDto };
    console.log(updatedPromotion.promotionType.id);
    if (updatedPromotion.promotionType.name !== 'ส่วนลด') {
      updatedPromotion.discount = 0;
    }
    await this.promoRepository.save(updatedPromotion);
    return this.promoRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const removedPromotion = await this.promoRepository.findOneByOrFail({ id });
    await this.promoRepository.remove(removedPromotion);
    return removedPromotion;
  }
}
