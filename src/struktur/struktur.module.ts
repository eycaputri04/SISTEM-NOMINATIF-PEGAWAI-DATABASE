import { Module } from '@nestjs/common';
import { StrukturService } from './struktur.service';
import { StrukturController } from './struktur.controller';

@Module({
  providers: [StrukturService],
  controllers: [StrukturController]
})
export class StrukturModule {}
