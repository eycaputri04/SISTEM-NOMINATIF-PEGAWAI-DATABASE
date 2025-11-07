import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreatePegawaiDto {
  @ApiProperty({ example: '1987654321', description: 'Nomor Induk Pegawai' })
  @IsNotEmpty()
  @IsString()
  NIP: string;

  @ApiProperty({ example: 'Siti Aminah', description: 'Nama lengkap pegawai' })
  @IsNotEmpty()
  @IsString()
  Nama: string;

  @ApiProperty({
    example: 'Jakarta, 1985-01-12',
    description: 'Tempat dan tanggal lahir pegawai',
  })
  @IsOptional()
  @IsString()
  Tempat_Tanggal_Lahir?: string;

  @ApiProperty({
    example: 'S1 Geofisika',
    description: 'Pendidikan terakhir pegawai',
  })
  @IsOptional()
  @IsString()
  Pendidikan_Terakhir?: string;

  @ApiProperty({
    example: 'III/a',
    description: 'Pangkat dan golongan pegawai',
  })
  @IsOptional()
  @IsString()
  Pangkat_Golongan?: string;

  @ApiProperty({
    example: '2025-05-10',
    description: 'Tanggal KGB berikutnya (format YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  KGB_Berikutnya?: string;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Tanggal mulai masa jabatan (TMT) (format YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  TMT?: string;

  @ApiProperty({
    example: 'Perempuan',
    description: 'Jenis kelamin pegawai',
  })
  @IsOptional()
  @IsString()
  Jenis_Kelamin?: string;

  @ApiProperty({
    example: 'Islam',
    description: 'Agama pegawai',
  })
  @IsOptional()
  @IsString()
  Agama?: string;

  @ApiProperty({
    example: 'PNS',
    description: 'Status kepegawaian pegawai',
  })
  @IsOptional()
  @IsString()
  Status_Kepegawaian?: string;

  @ApiProperty({
    example: 5500000,
    description: 'Gaji pokok pegawai (dalam rupiah)',
  })
  @IsOptional()
  @IsNumber()
  Gaji_Pokok?: number;

  @ApiProperty({
    example: 2,
    description: 'Jumlah anak pegawai',
  })
  @IsOptional()
  @IsInt()
  Jumlah_Anak?: number;
}
