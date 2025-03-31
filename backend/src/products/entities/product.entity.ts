import { Category } from 'src/categories/entities/category.entity';
import { ReceiptItem } from 'src/receipts/entities/receiptItem.entity';
import { Size } from 'src/sizes/entities/size.entity';
import { Type } from 'src/types/entities/type.entity';
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
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({ default: 'noimage.jpg' })
  image: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @ManyToMany(() => Size)
  @JoinTable()
  sizes: Size[];

  @ManyToMany(() => Type)
  @JoinTable()
  types: Type[];

  @OneToMany(() => ReceiptItem, (receiptItem) => receiptItem.product)
  receiptItems: ReceiptItem[];
}
