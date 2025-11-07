import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreatePenjenjanganDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID unik untuk data penjenjangan (UUID)',
  })
  @IsOptional()
  @IsUUID()
  ID_Penjenjangan?: string;

  @ApiProperty({
    example: '1987654321',
    description:
      'Nomor Induk Pegawai yang mengikuti penjenjangan ini (foreign key ke pegawai.NIP)',
  })
  @IsNotEmpty()
  @IsString()
  Pegawai: string;

  @ApiProperty({
    example: 'Pelatihan Kepemimpinan Administrator',
    description: 'Nama penjenjangan yang diikuti oleh pegawai',
  })
  @IsNotEmpty({ message: 'Nama penjenjangan tidak boleh kosong' })
  @IsString()
  Nama_Penjenjangan: string;

  @ApiProperty({
    example: 2022,
    description: 'Tahun pelaksanaan penjenjangan pegawai',
    required: false,
  })
  @IsOptional()
  @IsInt()
  Tahun_Pelaksanaan?: number;

  @ApiProperty({
    example: 'Lembaga Administrasi Negara (LAN)',
    description: 'Instansi atau pihak penyelenggara kegiatan penjenjangan',
    required: false,
  })
  @IsOptional()
  @IsString()
  Penyelenggara?: string;
}
