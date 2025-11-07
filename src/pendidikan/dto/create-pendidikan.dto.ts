import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreatePendidikanDto {
  @ApiProperty({
    example: 'f7c0b1a2-12d3-4a45-bcd6-89b1a9f7d3f2',
    description: 'ID unik untuk data pendidikan (UUID)',
  })
  @IsOptional()
  @IsUUID()
  ID_Pendidikan?: string;

  @ApiProperty({
    example: '1987654321',
    description:
      'Nomor Induk Pegawai yang memiliki pendidikan ini (foreign key ke pegawai.NIP)',
  })
  @IsNotEmpty()
  @IsString()
  Pegawai: string;

  @ApiProperty({
    example: 'S1',
    description: 'Jenjang pendidikan terakhir pegawai (misalnya: S1, S2, D3, SMA)',
  })
  @IsNotEmpty({ message: 'Jenjang pendidikan tidak boleh kosong' })
  @IsString()
  Jenjang: string;

  @ApiProperty({
    example: 'Geofisika',
    description: 'Jurusan atau bidang studi pendidikan pegawai',
    required: false,
  })
  @IsOptional()
  @IsString()
  Jurusan?: string;

  @ApiProperty({
    example: 'Universitas Gadjah Mada',
    description: 'Nama institusi pendidikan tempat pegawai menempuh studi',
    required: false,
  })
  @IsOptional()
  @IsString()
  Institusi?: string;

  @ApiProperty({
    example: 2010,
    description: 'Tahun kelulusan pendidikan pegawai',
    required: false,
  })
  @IsOptional()
  @IsInt()
  Tahun_Lulus?: number;
}
