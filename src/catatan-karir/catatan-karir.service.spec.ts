import { Test, TestingModule } from '@nestjs/testing';
import { CatatanKarirService } from './catatan-karir.service';

describe('CatatanKarirService', () => {
  let service: CatatanKarirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatatanKarirService],
    }).compile();

    service = module.get<CatatanKarirService>(CatatanKarirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
