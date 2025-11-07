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
import { StrukturService } from './struktur.service';
import { CreateStrukturDto } from './dto/create-struktur.dto';
import { UpdateStrukturDto } from './dto/update-struktur.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Struktur')
@Controller('struktur')
export class StrukturController {
  constructor(private readonly strukturService: StrukturService) {}

  // Tambah data struktur
  @Post()
  @ApiOperation({ summary: 'Tambah data struktur organisasi' })
  @ApiResponse({ status: 201, description: 'Struktur berhasil ditambahkan' })
  async create(@Body() body: CreateStrukturDto) {
    try {
      console.log('Data diterima:', body);
      const result = await this.strukturService.create(body);
      console.log('Hasil insert:', result);
      return result;
    } catch (error) {
      console.error('Error detail:', error);
      throw new BadRequestException('Gagal menambahkan struktur organisasi');
    }
  }

  // Ambil semua data struktur
  @Get()
  @ApiOperation({ summary: 'Mengambil semua data struktur organisasi' })
  @ApiResponse({ status: 200, description: 'Daftar semua struktur organisasi' })
  findAll() {
    return this.strukturService.findAll();
  }

  // Ambil jumlah total struktur
  @Get('count')
  @ApiOperation({ summary: 'Mengambil jumlah total struktur' })
  @ApiResponse({ status: 200, description: 'Total jumlah struktur' })
  getCount() {
    return this.strukturService.getCount();
  }

  // Ambil data struktur berdasarkan ID
  @Get(':id')
  @ApiOperation({ summary: 'Mengambil data struktur berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Data struktur ditemukan' })
  @ApiResponse({ status: 404, description: 'Struktur tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.strukturService.findOne(id);
  }

  // Update data struktur
  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui data struktur berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Struktur berhasil diperbarui' })
  update(@Param('id') id: string, @Body() dto: UpdateStrukturDto) {
    return this.strukturService.update(id, dto);
  }

  // Hapus data struktur
  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus data struktur berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Struktur berhasil dihapus' })
  remove(@Param('id') id: string) {
    return this.strukturService.remove(id);
  }
}
