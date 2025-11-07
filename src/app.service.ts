import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>SISNOMPEG Admin API</h1><p>Lihat dokumentasi di <a href="/api-docs">/api-docs</a></p>';
  }
}
