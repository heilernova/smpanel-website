import { Test, TestingModule } from '@nestjs/testing';
import { SmpanelApiService } from './smpanel-api.service';

describe('SmpanelApiService', () => {
  let service: SmpanelApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmpanelApiService],
    }).compile();

    service = module.get<SmpanelApiService>(SmpanelApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
