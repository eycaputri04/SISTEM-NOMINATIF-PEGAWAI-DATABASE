import { Test, TestingModule } from '@nestjs/testing';
import { PenjenjanganService } from './penjenjangan.service';

describe('PenjenjanganService', () => {
  let service: PenjenjanganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenjenjanganService],
    }).compile();

    service = module.get<PenjenjanganService>(PenjenjanganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
