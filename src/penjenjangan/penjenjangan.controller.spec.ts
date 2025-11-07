import { Test, TestingModule } from '@nestjs/testing';
import { PenjenjanganController } from './penjenjangan.controller';

describe('PenjenjanganController', () => {
  let controller: PenjenjanganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenjenjanganController],
    }).compile();

    controller = module.get<PenjenjanganController>(PenjenjanganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
