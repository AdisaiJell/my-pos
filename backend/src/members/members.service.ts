import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private membersRepository: Repository<Member>,
  ) {}
  create(createMemberDto: CreateMemberDto) {
    return this.membersRepository.save(createMemberDto);
  }

  findAll() {
    return this.membersRepository.find();
  }

  findOne(id: number) {
    return this.membersRepository.findOneBy({ id });
  }

  findOneByTel(tel: string) {
    return this.membersRepository.findOneBy({ tel: tel });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const updateMember = await this.membersRepository.findOneOrFail({
      where: { id },
    });
    const updatedMember = { ...updateMember, ...updateMemberDto };
    await this.membersRepository.save(updatedMember);
    return this.membersRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const removedMember = await this.membersRepository.findOneOrFail({
      where: { id },
    });
    await this.membersRepository.remove(removedMember);
    return removedMember;
  }
}
