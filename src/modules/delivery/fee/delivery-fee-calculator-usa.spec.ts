import { Test, TestingModule } from '@nestjs/testing';
import { Dimensions, Weight } from '@modules/common/models/product.model';
import {
  LengthUnit,
  WeightUnit,
} from '@modules/common/models/product.constant';
import { DeliverySpeed } from '../delivery.constant';
import { CalculateDeliveryFeeDto } from './calculate-delivery-fee.dto';
import { DeliveryFeeCalculatorUSA } from './delivery-fee-calculator-usa';

describe('DeliveryFeeCalculatorUSA', () => {
  let service: DeliveryFeeCalculatorUSA;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryFeeCalculatorUSA],
    }).compile();

    service = module.get<DeliveryFeeCalculatorUSA>(DeliveryFeeCalculatorUSA);
  });

  it('[InternationalDeliveryFee] weight 정보가 없을때는 기본배송료를 리턴', () => {
    // TODO
  });

  it('test calculateInternationalDelivery + DeliverySpeed.EXPEDITED', () => {
    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.LB, value: 1 }),
      ).amount,
    ).toBe(9.5);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.LB, value: 3 }),
      ).amount,
    ).toBe(13.5);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.LB, value: 5 }),
      ).amount,
    ).toBe(17);
  });

  it('test calculateInternationalDelivery + DeliverySpeed.STANDARD', () => {
    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.LB, value: 30 }),
      ).amount,
    ).toBe(13);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.LB, value: 30.1 }),
      ).amount,
    ).toBe(15);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.LB, value: 32 }),
      ).amount,
    ).toBe(15);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.LB, value: 40 }),
      ).amount,
    ).toBe(17.5);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.LB, value: 1025 }),
      ).amount,
    ).toBe(450.5);
  });
});

function createDto(
  deliverySpeed: DeliverySpeed,
  weight: Weight,
  title = 'product1',
  dimensions?: Dimensions,
): CalculateDeliveryFeeDto {
  if (!dimensions) {
    dimensions = { unit: LengthUnit.IN, width: 1, height: 1, depth: 1 };
  }
  return {
    title,
    deliverySpeed,
    deliveryFrom: 'USA',
    platformDomainName: 'www.amazon.com',
    productPrice: { currencyCode: 'USD', amount: 100 },
    weight,
    dimensions,
    quantity: 1,
  };
}
