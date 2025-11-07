import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';

export class CreateCatatanKarirDto {
  @ApiProperty({
    example: '197303131995031001',
    description: 'Nomor Induk Pegawai (relasi ke tabel pegawai)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(18, 18, { message: 'NIP harus terdiri dari 18 digit' })
  NIP: string;

  @ApiProperty({
    example: 'IV.b',
    description: 'Pangkat atau golongan pegawai saat ini',
  })
  @IsNotEmpty()
  @IsString()
  Pangkat_Sekarang: string;

  @ApiProperty({
    example: 'IV.c',
    description: 'Pangkat atau golongan tujuan yang diproyeksikan',
  })
  @IsOptional()
  @IsString()
  Potensi_Pangkat_Baru?: string;

  @ApiProperty({
    example: '2025-04-01',
    description: 'Tanggal pegawai layak naik pangkat (format YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  Tanggal_Layak?: string;

  @ApiProperty({
    example: 'Layak',
    description:
      'Status kelayakan kenaikan pangkat (contoh: Layak, Belum Layak, Menunggu SK)',
  })
  @IsOptional()
  @IsString()
  Status?: string;

  @ApiProperty({
    example: 'Sudah memenuhi masa kerja 4 tahun dan memiliki pendidikan S2.',
    description: 'Catatan tambahan terkait karir atau pertimbangan lain',
  })
  @IsOptional()
  @IsString()
  Catatan?: string;
}
