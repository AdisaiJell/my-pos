import { Size } from 'src/sizes/entities/size.entity';
import { Type } from 'src/types/entities/type.entity';

export class CreateReceiptDto {
  receiptItems: {
    productId: number;
    qty: number;
    size?: Size;
    type?: Type;
    sweetLv?: string;
  }[];
  promoDiscount: number;
  memberDiscount: number;
  paymentType: string;
  userId: number;
  memberId?: number;
  promotionId?: number;
}
