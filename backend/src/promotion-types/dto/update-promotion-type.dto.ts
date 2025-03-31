import { PartialType } from '@nestjs/swagger';
import { CreatePromotionTypeDto } from './create-promotion-type.dto';

export class UpdatePromotionTypeDto extends PartialType(
  CreatePromotionTypeDto,
) {}
