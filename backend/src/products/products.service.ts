import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = parseFloat(createProductDto.price);
    product.category = JSON.parse(createProductDto.category);
    if (product.category.name === 'เครื่องดื่ม') {
      product.sizes = JSON.parse(createProductDto.sizes);
      product.types = JSON.parse(createProductDto.types);
    }
    if (createProductDto.image && createProductDto.image !== '') {
      product.image = createProductDto.image;
    }
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({
      relations: { sizes: true, types: true, category: true },
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: { sizes: true, types: true, category: true },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneOrFail({
      where: { id },
      relations: { sizes: true, types: true, category: true },
    });
    product.name = updateProductDto.name;
    product.price = parseFloat(updateProductDto.price);
    product.category = JSON.parse(updateProductDto.category);
    if (product.category.name === 'เครื่องดื่ม') {
      product.sizes = JSON.parse(updateProductDto.sizes);
      product.types = JSON.parse(updateProductDto.types);
    } else {
      product.sizes = null;
      product.types = null;
    }
    if (updateProductDto.image && updateProductDto.image !== '') {
      product.image = updateProductDto.image;
    }
    await this.productsRepository.save(product);
    return this.productsRepository.findOne({
      where: { id },
      relations: { sizes: true, types: true, category: true },
    });
  }

  async remove(id: number) {
    const removedUser = await this.productsRepository.findOneByOrFail({ id });
    await this.productsRepository.remove(removedUser);
    return removedUser;
  }
}
