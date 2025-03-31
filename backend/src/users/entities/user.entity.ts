import { Branch } from 'src/branches/entities/branch.entity';
import { Receipt } from 'src/receipts/entities/receipt.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  gender: string;

  @Column({ default: 12000 })
  salaryRate: number;

  @Column({ default: 'noimage.jpg' })
  image: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  role: Role;

  @ManyToOne(() => Branch, (branch) => branch.users, { nullable: true })
  branch: Branch;

  @OneToMany(() => Receipt, (receipt) => receipt.user)
  receipts: Receipt[];
}
