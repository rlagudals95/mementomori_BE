import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe.skip('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateService],
    }).compile();

    process.env.REST_CLIENT_RETRY_ATTEMPT_COUNT = '0';
    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('test', async () => {
    expect(service).toBeDefined();
  });
});
