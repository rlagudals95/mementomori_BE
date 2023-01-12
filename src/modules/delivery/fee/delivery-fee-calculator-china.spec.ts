import { Test, TestingModule } from '@nestjs/testing';
import { Dimensions, Weight } from '@modules/common/models/product.model';
import {
  LengthUnit,
  WeightUnit,
} from '@modules/common/models/product.constant';
import { DeliverySpeed } from '../delivery.constant';
import { CalculateDeliveryFeeDto } from './calculate-delivery-fee.dto';
import { DeliveryFeeCalculatorChina } from './delivery-fee-calculator-china';

describe('DeliveryFeeCalculatorChina', () => {
  let service: DeliveryFeeCalculatorChina;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryFeeCalculatorChina],
    }).compile();

    service = module.get<DeliveryFeeCalculatorChina>(
      DeliveryFeeCalculatorChina,
    );
  });

  it('[InternationalDeliveryFee] weight 정보가 없을때는 기본배송료를 리턴', () => {
    // TODO
  });

  it('test calculateInternationalDelivery + DeliverySpeed.EXPEDITED', () => {
    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.KG, value: 0.1 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.KG, value: 0.5 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.KG, value: 0.8 }),
      ).amount,
    ).toBe(5000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.KG, value: 1 }),
      ).amount,
    ).toBe(5000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.EXPEDITED, { unit: WeightUnit.KG, value: 2 }),
      ).amount,
    ).toBe(7000);
  });

  it('test calculateInternationalDelivery + DeliverySpeed.STANDARD', () => {
    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.KG, value: 0.1 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.KG, value: 0.5 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.KG, value: 0.8 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.KG, value: 1 }),
      ).amount,
    ).toBe(4000);

    expect(
      service.calculateInternationalDelivery(
        createDto(DeliverySpeed.STANDARD, { unit: WeightUnit.KG, value: 2 }),
      ).amount,
    ).toBe(6000);
  });
});

function createDto(
  deliverySpeed: DeliverySpeed,
  weight: Weight,
  title = 'product1',
  dimensions?: Dimensions,
): CalculateDeliveryFeeDto {
  if (!dimensions) {
    dimensions = { unit: LengthUnit.CM, width: 1, height: 1, depth: 1 };
  }
  return {
    title,
    deliverySpeed,
    deliveryFrom: 'CN',
    platformDomainName: 'global.jd.com',
    productPrice: { currencyCode: 'CNY', amount: 1 },
    weight,
    dimensions,
    quantity: 1,
  };
}
