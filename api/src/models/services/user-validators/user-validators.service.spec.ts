import { Test, TestingModule } from '@nestjs/testing';
import { UserValidatorsService } from './user-validators.service';

describe('UserValidatorsService', () => {
  let service: UserValidatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserValidatorsService],
    }).compile();

    service = module.get<UserValidatorsService>(UserValidatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
