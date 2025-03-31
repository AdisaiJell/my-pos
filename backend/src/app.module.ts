import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { PromotionsModule } from './promotions/promotions.module';
import { MembersModule } from './members/members.module';
import { ProductsModule } from './products/products.module';
import { SizesModule } from './sizes/sizes.module';
import { TypesModule } from './types/types.module';
import { CategoriesModule } from './categories/categories.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Receipt } from './receipts/entities/receipt.entity';
import { ReceiptItem } from './receipts/entities/receiptItem.entity';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/category.entity';
import { Size } from './sizes/entities/size.entity';
import { Type } from './types/entities/type.entity';
import { Promotion } from './promotions/entities/promotion.entity';
import { Member } from './members/entities/member.entity';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PromotionTypesModule } from './promotion-types/promotion-types.module';
import { PromotionType } from './promotion-types/entities/promotion-type.entity';
import { BranchesModule } from './branches/branches.module';
import { Branch } from './branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      entities: [
        Branch,
        User,
        Role,
        Receipt,
        ReceiptItem,
        Product,
        Category,
        Type,
        Size,
        Promotion,
        PromotionType,
        Member,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    RolesModule,
    ReceiptsModule,
    PromotionsModule,
    MembersModule,
    ProductsModule,
    SizesModule,
    TypesModule,
    CategoriesModule,
    AuthModule,
    PromotionTypesModule,
    BranchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
