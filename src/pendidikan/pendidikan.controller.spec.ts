import { Test, TestingModule } from '@nestjs/testing';
import { PendidikanController } from './pendidikan.controller';

describe('PendidikanController', () => {
  let controller: PendidikanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendidikanController],
    }).compile();

    controller = module.get<PendidikanController>(PendidikanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
