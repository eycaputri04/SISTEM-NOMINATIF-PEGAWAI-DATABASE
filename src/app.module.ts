import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modul-modul
import { AuthModule } from './auth/auth.module';
import { PegawaiModule } from './pegawai/pegawai.module';
import { PendidikanModule } from './pendidikan/pendidikan.module';
import { PenjenjanganModule } from './penjenjangan/penjenjangan.module';
import { StrukturModule } from './struktur/struktur.module';
import { AktivitasModule } from './aktivitas/aktivitas.module';
import { CatatanKarirModule } from './catatan-karir/catatan-karir.module';
import { CatatanKarirController } from './catatan-karir/catatan-karir.controller';

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MAILER (INI YANG WAJIB DITAMBAH)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get('eycaputri04@gmail.com'),
            pass: config.get('eyca160603'),
          },
        },
        defaults: {
          from: `"Sistem KGB BMKG" <${config.get('eycaputri04@gmail.com')}>`,
        },
      }),
    }),

    // Modul utama
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
