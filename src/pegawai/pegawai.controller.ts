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
import { PegawaiService } from './pegawai.service';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pegawai')
@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) {}

  // ================== Create Pegawai ==================
  @Post()
  @ApiOperation({ summary: 'Menambahkan pegawai baru' })
  @ApiResponse({ status: 201, description: 'Pegawai berhasil ditambahkan' })
  async create(@Body() body: CreatePegawaiDto) {
    try {
      console.log('Data diterima:', body);
      const result = await this.pegawaiService.create(body);
      console.log('Hasil insert:', result);
      return result;
    } catch (error: any) {
      console.error('Error detail:', error);
      throw new BadRequestException(error.message || 'Gagal menambahkan pegawai');
    }
  }

  // ================== Ambil Semua Pegawai ==================
  @Get()
  @ApiOperation({ summary: 'Mengambil semua data pegawai' })
  @ApiResponse({ status: 200, description: 'Daftar semua pegawai' })
  async findAll() {
    try {
      return await this.pegawaiService.findAll();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal mengambil data pegawai');
    }
  }

  // ================== Ambil Count Pegawai ==================
  @Get('count')
  @ApiOperation({ summary: 'Mengambil jumlah total pegawai' })
  @ApiResponse({ status: 200, description: 'Total jumlah pegawai' })
  async getCount() {
    try {
      return await this.pegawaiService.getCount();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal mengambil total pegawai');
    }
  }

  // ================== Ambil Pegawai Berdasarkan NIP ==================
  @Get(':nip')
  @ApiOperation({ summary: 'Mengambil data pegawai berdasarkan NIP' })
  @ApiResponse({ status: 200, description: 'Data pegawai ditemukan' })
  @ApiResponse({ status: 404, description: 'Pegawai tidak ditemukan' })
  async findOne(@Param('nip') nip: string) {
    try {
      return await this.pegawaiService.findOne(nip);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Pegawai tidak ditemukan');
    }
  }

  // ================== Update Pegawai ==================
  @Put(':nip')
  @ApiOperation({ summary: 'Memperbarui data pegawai berdasarkan NIP' })
  @ApiResponse({ status: 200, description: 'Pegawai berhasil diperbarui' })
  async update(@Param('nip') nip: string, @Body() dto: UpdatePegawaiDto) {
    try {
      return await this.pegawaiService.update(nip, dto);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal memperbarui pegawai');
    }
  }

  // ================== Delete Pegawai ==================
  @Delete(':nip')
  @ApiOperation({ summary: 'Menghapus pegawai berdasarkan NIP' })
  @ApiResponse({ status: 200, description: 'Pegawai berhasil dihapus' })
  async remove(@Param('nip') nip: string) {
    try {
      return await this.pegawaiService.remove(nip);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal menghapus pegawai');
    }
  }

  // ================== Dashboard Stats ==================
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Mengambil statistik pegawai untuk dashboard' })
  @ApiResponse({ status: 200, description: 'Statistik pegawai berhasil diambil' })
  async getDashboardStats() {
    try {
      return await this.pegawaiService.getDashboardStats();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal mengambil statistik pegawai');
    }
  }

  @Get('kgb/notifikasi')
  @ApiOperation({ summary: 'Notifikasi otomatis KGB terdekat atau terlewat' })
  @ApiResponse({ status: 200, description: 'Daftar pegawai dengan KGB jatuh tempo' })
  async getKGBNotif() {
    try {
      return await this.pegawaiService.getKGBNotif();
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Gagal mengambil notifikasi KGB');
    }
  }

}
