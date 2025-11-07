import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CatatanKarirService } from './catatan-karir.service';
import { CreateCatatanKarirDto } from './dto/create-catatankarir.dto';
import { UpdateCatatanKarirDto } from './dto/update-catatankarir.dto';

@Controller('catatan-karir')
export class CatatanKarirController {
  constructor(private readonly catatanKarirService: CatatanKarirService) {}

  /** GET: Ambil semua data catatan karir */
  @Get()
  async findAll() {
    return this.catatanKarirService.findAll();
  }

  /** GET: Ambil satu catatan karir berdasarkan ID */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.catatanKarirService.findOne(id);
  }

  /** POST: Tambah catatan karir baru */
  @Post()
  async create(@Body() createDto: CreateCatatanKarirDto) {
    return this.catatanKarirService.create(createDto);
  }

  /** PUT: Update catatan karir berdasarkan ID */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCatatanKarirDto,
  ) {
    return this.catatanKarirService.update(id, updateDto);
  }

  /** DELETE: Hapus catatan karir berdasarkan ID */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.catatanKarirService.remove(id);
  }

  /** GET: Mengecek kelayakan kenaikan pangkat berdasarkan NIP */
  @Get('cek/:nip')
  async checkEligibility(@Param('nip') nip: string) {
    return this.catatanKarirService.checkEligibility(nip);
  }
}
