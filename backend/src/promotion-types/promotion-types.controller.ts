import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionTypesService } from './promotion-types.service';
import { CreatePromotionTypeDto } from './dto/create-promotion-type.dto';
import { UpdatePromotionTypeDto } from './dto/update-promotion-type.dto';

@Controller('promotion-types')
export class PromotionTypesController {
  constructor(private readonly promotionTypesService: PromotionTypesService) {}

  @Post()
  create(@Body() createPromotionTypeDto: CreatePromotionTypeDto) {
    return this.promotionTypesService.create(createPromotionTypeDto);
  }

  @Get()
  findAll() {
    return this.promotionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionTypeDto: UpdatePromotionTypeDto,
  ) {
    return this.promotionTypesService.update(+id, updatePromotionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionTypesService.remove(+id);
  }
}
