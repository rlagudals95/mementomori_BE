import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { DeliveryFeeCalculator } from './fee/delivery-fee-calculator';
import { DeliveryFeeCalculatorChina } from './fee/delivery-fee-calculator-china';
import { DeliveryFeeCalculatorUSA } from './fee/delivery-fee-calculator-usa';

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        DeliveryFeeCalculator,
        DeliveryFeeCalculatorUSA,
        DeliveryFeeCalculatorChina,
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
  });

  it('test ', () => {
    expect(service).toBeDefined();
  });
});
