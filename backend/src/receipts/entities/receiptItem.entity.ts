import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Receipt } from './receipt.entity';
import { Product } from 'src/products/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import { Type } from 'src/types/entities/type.entity';

@Entity()
export class ReceiptItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  qty: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  sweetLv: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Size, (size) => size.receiptItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  size: Size;

  @ManyToOne(() => Type, (type) => type.receiptItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  type: Type;

  @ManyToOne(() => Receipt, (receipt) => receipt.receiptItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  receipt: Receipt;

  @ManyToOne(() => Product, (product) => product.receiptItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;
}
