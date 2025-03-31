import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { Between, Repository } from 'typeorm';
import { ReceiptItem } from './entities/receiptItem.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Member } from 'src/members/entities/member.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt) private receiptsRepository: Repository<Receipt>,
    @InjectRepository(ReceiptItem)
    private receiptItemsRepository: Repository<ReceiptItem>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Member) private membersRepository: Repository<Member>,
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  calPriceProduct(name: string): number {
    if (name === 'm') {
      return 5;
    } else if (name == 'l') {
      return 10;
    }
    return 0;
  }

  async create(createReceiptDto: CreateReceiptDto) {
    const receipt = new Receipt();
    const user = await this.usersRepository.findOne({
      where: {
        id: createReceiptDto.userId,
      },
      relations: { branch: true },
    });
    if (createReceiptDto.memberId) {
      const member = await this.membersRepository.findOneBy({
        id: createReceiptDto.memberId,
      });
      receipt.member = member;
      console.log('member = ', receipt.member);
    }
    if (createReceiptDto.promotionId) {
      const promotion = await this.promotionsRepository.findOneBy({
        id: createReceiptDto.promotionId,
      });
      receipt.promotion = promotion;
    }
    receipt.user = user;
    receipt.branch = user.branch;
    receipt.total = 0;
    receipt.qty = 0;
    receipt.paymentType = createReceiptDto.paymentType;
    receipt.promotionDiscount = createReceiptDto.promoDiscount;
    receipt.memberDiscount = createReceiptDto.memberDiscount;
    receipt.receiptItems = [];
    for (const rcptItem of createReceiptDto.receiptItems) {
      const receiptItem = new ReceiptItem();
      receiptItem.product = await this.productsRepository.findOneBy({
        id: rcptItem.productId,
      });
      receiptItem.name = receiptItem.product.name;
      if (rcptItem.size && rcptItem.type && rcptItem.sweetLv) {
        receiptItem.size = rcptItem.size;
        receiptItem.type = rcptItem.type;
        receiptItem.sweetLv = rcptItem.sweetLv;
        receiptItem.price =
          receiptItem.product.price +
          this.calPriceProduct(receiptItem.size.name);
      } else {
        receiptItem.price = receiptItem.product.price;
      }
      receiptItem.qty = rcptItem.qty;

      receiptItem.total = rcptItem.qty * receiptItem.price;

      console.log('receiptItem Total = ', receiptItem.total);
      await this.receiptItemsRepository.save(receiptItem);
      receipt.receiptItems.push(receiptItem);
      receipt.total += receiptItem.total;
      receipt.qty += receiptItem.qty;
    }
    console.log(receipt);
    return this.receiptsRepository.save(receipt);
  }

  findAll() {
    return this.receiptsRepository.find({
      relations: { receiptItems: true, user: true, branch: true },
      order: { id: 'desc' },
    });
  }

  async findAllByUser(userId: number) {
    console.log(userId);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true, branch: true },
    });
    if (user.role.id == 2) {
      console.log('enter userId2');
      return this.receiptsRepository.find({
        where: { user: { id: userId } },
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    } else if (user.role.id == 1) {
      console.log('enter userId1', user.branch);
      return this.receiptsRepository.find({
        where: { branch: { id: user.branch.id } },
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    } else {
      return this.receiptsRepository.find({
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    }
  }

  async findAllByTime(startDate: Date, endDate: Date, id: number) {
    console.log(startDate, endDate);
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    console.log(user);
    if (user.role.id == 2) {
      console.log('enter1');
      return this.receiptsRepository.find({
        where: { user: { id: user.id }, created: Between(startDate, endDate) },
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    } else if (user.role.id == 1) {
      console.log('enter2');
      return this.receiptsRepository.find({
        where: { branch: user.branch, created: Between(startDate, endDate) },
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    } else {
      console.log('enter3');
      return this.receiptsRepository.find({
        where: { created: Between(startDate, endDate) },
        relations: { receiptItems: true, user: true, branch: true },
        order: { id: 'desc' },
      });
    }
  }

  findOne(id: number) {
    return this.receiptsRepository.findOneOrFail({
      where: { id },
      relations: { receiptItems: true, user: true, branch: true },
    });
  }

  update(id: number, updateReceiptDto: UpdateReceiptDto) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }
}
