import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchesRepository: Repository<Branch>,
  ) {}

  create(createBranchDto: CreateBranchDto) {
    const branch = new Branch();
    branch.name = createBranchDto.name;
    return this.branchesRepository.save(branch);
  }

  findAll() {
    return this.branchesRepository.find({ relations: { users: true } });
  }

  findOne(id: number) {
    return this.branchesRepository.findOneOrFail({
      where: { id },
      relations: { users: true },
    });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchesRepository.findOneByOrFail({ id: id });
    branch.name = updateBranchDto.name;
    await this.branchesRepository.save(branch);
    return this.branchesRepository.findOneByOrFail({ id: id });
  }

  async remove(id: number) {
    const branchRemoved = await this.branchesRepository.findOneByOrFail({
      id: id,
    });
    return this.branchesRepository.remove(branchRemoved);
  }
}
