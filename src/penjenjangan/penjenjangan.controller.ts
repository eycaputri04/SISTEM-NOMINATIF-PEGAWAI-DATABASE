import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PenjenjanganService } from './penjenjangan.service';
import { CreatePenjenjanganDto } from './dto/create-penjenjangan.dto';
import { UpdatePenjenjanganDto } from './dto/update-penjenjangan.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Penjenjangan')
@Controller('penjenjangan')
export class PenjenjanganController {
  constructor(private readonly penjenjanganService: PenjenjanganService) {}

  @Post()
  @ApiOperation({ summary: 'Menambahkan data penjenjangan baru' })
  @ApiResponse({ status: 201, description: 'Data penjenjangan berhasil ditambahkan' })
  async create(@Body() body: CreatePenjenjanganDto) {
    console.log('📥 Data diterima:', body);
    try {
      const result = await this.penjenjanganService.create(body);
      console.log('✅ Hasil insert:', result);
      return result;
    } catch (error) {
      console.error('Error detail:', error);
      // Jika sudah dari service, biarkan pesan error asli keluar
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Gagal menambahkan data penjenjangan');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil semua data penjenjangan' })
  findAll() {
    return this.penjenjanganService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil data penjenjangan berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.penjenjanganService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui data penjenjangan berdasarkan ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePenjenjanganDto) {
    return this.penjenjanganService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus data penjenjangan berdasarkan ID' })
  remove(@Param('id') id: string) {
    return this.penjenjanganService.remove(id);
  }
}
