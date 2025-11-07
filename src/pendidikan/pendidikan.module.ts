import { Module } from '@nestjs/common';
import { PendidikanController } from './pendidikan.controller';
import { PendidikanService } from './pendidikan.service';

@Module({
  controllers: [PendidikanController],
  providers: [PendidikanService]
})
export class PendidikanModule {}
