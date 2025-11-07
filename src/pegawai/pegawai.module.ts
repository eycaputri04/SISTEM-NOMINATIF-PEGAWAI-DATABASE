import { Module } from '@nestjs/common';
import { PegawaiController } from './pegawai.controller';
import { PegawaiService } from './pegawai.service';

@Module({
  controllers: [PegawaiController],
  providers: [PegawaiService]
})
export class PegawaiModule {}
