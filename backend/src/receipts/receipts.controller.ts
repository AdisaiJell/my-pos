import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptsService.create(createReceiptDto);
  }

  @Get()
  findAll() {
    console.log(new Date());
    return this.receiptsService.findAll();
  }

  @Get('user/:id')
  findAllByUser(@Param('id') id: number) {
    return this.receiptsService.findAllByUser(id);
  }

  @Get('date/:startDate/:endDate/:id')
  findAllByTime(
    @Param('id') id: number,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const start = new Date(startDate).toDateString();
    const end = new Date(endDate).toDateString();

    return this.receiptsService.findAllByTime(
      new Date(start),
      new Date(end),
      id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptsService.update(+id, updateReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptsService.remove(+id);
  }
}
