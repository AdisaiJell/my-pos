import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { User } from 'src/users/entities/user.entity';
import { ReceiptItem } from './entities/receiptItem.entity';
import { Product } from 'src/products/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import { Type } from 'src/types/entities/type.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { Member } from 'src/members/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Receipt,
      ReceiptItem,
      User,
      Product,
      Size,
      Type,
      Promotion,
      Member,
    ]),
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
