import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PendidikanService } from './pendidikan.service';
import { CreatePendidikanDto } from './dto/create-pendidikan.dto';
import { UpdatePendidikanDto } from './dto/update-pendidikan.dto';

@Controller('pendidikan')
export class PendidikanController {
  constructor(private readonly pendidikanService: PendidikanService) {}

  /** CREATE Pendidikan */
  @Post()
  create(@Body() createDto: CreatePendidikanDto) {
    return this.pendidikanService.create(createDto);
  }

  /** READ ALL Pendidikan */
  @Get()
  findAll() {
    return this.pendidikanService.findAll();
  }

  /** READ ONE Pendidikan */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pendidikanService.findOne(id);
  }

  /** UPDATE Pendidikan (PUT) */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePendidikanDto) {
    return this.pendidikanService.update(id, updateDto);
  }

  /** DELETE Pendidikan */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pendidikanService.remove(id);
  }

  /** COUNT Pendidikan */
  @Get('count/all')
  getCount() {
    return this.pendidikanService.getCount();
  }
}
