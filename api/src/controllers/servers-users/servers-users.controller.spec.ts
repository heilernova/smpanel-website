import { Test, TestingModule } from '@nestjs/testing';
import { ServersUsersController } from './servers-users.controller';

describe('ServersUsersController', () => {
  let controller: ServersUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServersUsersController],
    }).compile();

    controller = module.get<ServersUsersController>(ServersUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
