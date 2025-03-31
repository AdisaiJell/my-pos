import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size) private sizesRepository: Repository<Size>,
  ) {}
  create(createSizeDto: CreateSizeDto) {
    return 'This action adds a new size';
  }

  findAll() {
    return this.sizesRepository.find();
  }

  findOne(id: number) {
    return this.sizesRepository.findOne({ where: { id } });
  }

  update(id: number, updateSizeDto: UpdateSizeDto) {
    return `This action updates a #${id} size`;
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
