import { Product } from 'src/products/entities/product.entity';
import { PromotionType } from 'src/promotion-types/entities/promotion-type.entity';
import { Receipt } from 'src/receipts/entities/receipt.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  discount: number; // percent

  @Column({ default: 0 })
  minimum: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(() => Product)
  @JoinTable()
  promoProducts: Product[];

  @OneToMany(() => Receipt, (receipt) => receipt.promotion)
  receipts: Receipt[];

  @ManyToOne(() => PromotionType, (promotionType) => promotionType.promotions, {
    onDelete: 'CASCADE',
  })
  promotionType: PromotionType;
}
