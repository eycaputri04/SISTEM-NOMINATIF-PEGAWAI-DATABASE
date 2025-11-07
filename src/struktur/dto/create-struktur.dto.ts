import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateStrukturDto {
  @ApiProperty({
    example: 'b7e6f7a9-2c8a-4bde-9b3f-9e2c9d5e9a6f',
    description: 'ID unik untuk struktur organisasi (UUID)',
  })
  @IsOptional()
  @IsUUID()
  ID_Struktur?: string;

  @ApiProperty({
    example: '1987654321',
    description: 'Nomor Induk Pegawai yang terkait dengan struktur (NIP)',
  })
  @IsNotEmpty()
  @IsString()
  Pegawai: string;

  @ApiProperty({
    example: 'Kepala Seksi Observasi',
    description: 'Nama jabatan dalam struktur organisasi',
  })
  @IsNotEmpty()
  @IsString()
  Jabatan: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Tanggal mulai masa jabatan (TMT) dalam format YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  TMT?: string;
}
