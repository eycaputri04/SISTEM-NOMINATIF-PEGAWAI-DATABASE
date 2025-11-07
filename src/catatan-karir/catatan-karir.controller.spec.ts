import { Test, TestingModule } from '@nestjs/testing';
import { CatatanKarirController } from './catatan-karir.controller';

describe('CatatanKarirController', () => {
  let controller: CatatanKarirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatatanKarirController],
    }).compile();

    controller = module.get<CatatanKarirController>(CatatanKarirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
