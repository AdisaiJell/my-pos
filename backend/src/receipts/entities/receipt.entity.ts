import { Member } from 'src/members/entities/member.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReceiptItem } from './receiptItem.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  qty: number;

  @Column()
  promotionDiscount: number;
  @Column()
  memberDiscount: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ default: 'cash' })
  paymentType: string;

  @OneToMany(() => ReceiptItem, (receiptItem) => receiptItem.receipt)
  receiptItems: ReceiptItem[];

  @ManyToOne(() => User, (user) => user.receipts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.receipts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  promotion: Promotion;

  @ManyToOne(() => Member, (member) => member.receipts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  member: Member;

  @ManyToOne(() => Branch, (branch) => branch.receipts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  branch: Branch;
}
