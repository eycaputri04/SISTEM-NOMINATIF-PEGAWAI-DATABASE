import { Module } from '@nestjs/common';
import { CatatanKarirService } from './catatan-karir.service';
import { CatatanKarirController } from './catatan-karir.controller';

@Module({
  controllers: [CatatanKarirController],
  providers: [CatatanKarirService],
  exports: [CatatanKarirService], 
})
export class CatatanKarirModule {}
