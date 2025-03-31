import { Product } from 'src/products/entities/product.entity';
import { PromotionType } from 'src/promotion-types/entities/promotion-type.entity';

export class CreatePromotionDto {
  id: number;
  name: string;
  discount: number; // percent
  minimum: number;
  startDate: Date;
  endDate: Date;
  promotionType: PromotionType;
  promoProduct: Product[];
}
