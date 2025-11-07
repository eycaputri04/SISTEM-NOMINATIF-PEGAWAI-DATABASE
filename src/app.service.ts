import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'SISNOMPEG Admin Backend aktif ',
      author: 'BMKG Bengkulu - Eyca Putri',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }
}
