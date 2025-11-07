import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { waitForSupabaseReady } from './supabase/supabase.client';

async function bootstrap() {
  // Pastikan Supabase siap
  await waitForSupabaseReady();

  const app = await NestFactory.create(AppModule);

  // Middleware untuk body parser
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Dokumentasi')
    .setDescription('Dokumentasi endpoint API untuk Aplikasi Struktur Organisasi')
    .setVersion('1.0')
    .addTag('pegawai')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Port dengan fallback otomatis
  const DEFAULT_PORT = 3001;
  const port = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;

  try {
    await app.listen(port);
    console.log(`Server running at http://localhost:${port}/api`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      const newPort = port + 1;
      console.warn(`Port ${port} sudah digunakan. Coba port ${newPort}...`);
      await app.listen(newPort);
      console.log(`Server running at http://localhost:${newPort}/api`);
    } else {
      console.error('Gagal menjalankan server:', err);
      process.exit(1);
    }
  }
}

bootstrap();
