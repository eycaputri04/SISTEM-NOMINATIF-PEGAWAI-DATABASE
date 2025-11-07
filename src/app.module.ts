import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import semua modul aktif
import { AuthModule } from './auth/auth.module';
import { PegawaiModule } from './pegawai/pegawai.module';
import { PendidikanModule } from './pendidikan/pendidikan.module';
import { PenjenjanganModule } from './penjenjangan/penjenjangan.module';
import { StrukturModule } from './struktur/struktur.module';
import { AktivitasModule } from './aktivitas/aktivitas.module';
import { CatatanKarirController } from './catatan-karir/catatan-karir.controller';
import { CatatanKarirModule } from './catatan-karir/catatan-karir.module';

@Module({
  imports: [
    // Load environment variable secara global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Modul-modul aktif
    AuthModule,
    PegawaiModule,
    PendidikanModule,
    PenjenjanganModule,
    StrukturModule,
    AktivitasModule,
    CatatanKarirModule,
  ],
  controllers: [AppController, CatatanKarirController],
  providers: [AppService],
})
export class AppModule {}
