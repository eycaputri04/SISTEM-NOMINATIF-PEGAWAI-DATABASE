import { Module } from '@nestjs/common';
import { PenjenjanganController } from './penjenjangan.controller';
import { PenjenjanganService } from './penjenjangan.service';

@Module({
  controllers: [PenjenjanganController],
  providers: [PenjenjanganService]
})
export class PenjenjanganModule {}
