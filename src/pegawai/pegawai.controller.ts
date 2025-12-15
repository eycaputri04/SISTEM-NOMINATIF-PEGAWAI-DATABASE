import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PegawaiService } from './pegawai.service';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pegawai')
@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) {}

  // ================== CREATE ==================
  @Post()
  @ApiOperation({ summary: 'Menambahkan pegawai baru' })
  async create(@Body() body: CreatePegawaiDto) {
    return this.pegawaiService.create(body);
  }

  // ================== READ ALL ==================
  @Get()
  @ApiOperation({ summary: 'Mengambil semua data pegawai' })
  async findAll() {
    return this.pegawaiService.findAll();
  }

  // ================== DASHBOARD ==================
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Statistik pegawai untuk dashboard' })
  async getDashboardStats() {
    return this.pegawaiService.getDashboardStats();
  }

  // ================== PROSES KGB OTOMATIS ==================
  @Get('kgb/proses')
  @ApiOperation({ summary: 'Memproses KGB otomatis dan kirim email admin' })
  async prosesKGB() {
    return this.pegawaiService.processKGBOtomatis();
  }

  // ================== READ BY NIP (PALING BAWAH) ==================
  @Get(':nip')
  @ApiOperation({ summary: 'Mengambil data pegawai berdasarkan NIP' })
  async findOne(@Param('nip') nip: string) {
    return this.pegawaiService.findOne(nip);
  }

  // ================== UPDATE ==================
  @Put(':nip')
  @ApiOperation({ summary: 'Update data pegawai' })
  async update(
    @Param('nip') nip: string,
    @Body() dto: UpdatePegawaiDto,
  ) {
    return this.pegawaiService.update(nip, dto);
  }
}
