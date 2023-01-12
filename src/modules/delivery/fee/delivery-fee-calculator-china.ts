import { Injectable, NotImplementedException } from '@nestjs/common';
import convert from 'convert';
import { WeightUnit } from '@modules/common/models/product.constant';
import { Price } from '@modules/common/models/product.model';
import { DeliverySpeed } from '../delivery.constant';
import { ceiling, createPriceFactory } from './delivery-fee-calculation.util';
import {
  CalculateDeliveryFee,
  DeliveryFeeCalculatable,
} from './delivery-fee-calculatorable.interface';

@Injectable()
export class DeliveryFeeCalculatorChina implements DeliveryFeeCalculatable {
  toPrice = createPriceFactory(this.getCurrencyCode());

  getCountryCode(): string {
    return 'CN';
  }

  getCurrencyCode(): string {
    return 'CNY';
  }

  calculateShopLocalDelivery(request: CalculateDeliveryFee): Price {
    request.platformDomainName;
    return this.toPrice(0); // TODO
  }

  calculateInternationalDelivery(request: CalculateDeliveryFee): Price {
    if (!request.weight) {
      return this.toPrice(0); // TODO: category나 product name을 통해서 예측
    }

    let weightInKg = convert(request.weight.value, request.weight.unit).to(
      WeightUnit.KG,
    );
    weightInKg = ceiling(weightInKg, 0.5);

    if (request.deliverySpeed == DeliverySpeed.EXPEDITED) {
      const kockoc = 2900 + ((weightInKg - 0.5) / 0.5) * 1000;
      const ohzig = ceiling(kockoc * 1.1, 1000);
      return this.toPrice(ohzig * request.quantity);
    } else if (request.deliverySpeed == DeliverySpeed.STANDARD) {
      const kockoc = 3000 + ((weightInKg - 0.5) / 0.5) * 600;
      const ohzig = ceiling(kockoc * 1.1, 1000);
      return this.toPrice(ohzig * request.quantity);
    }

    throw new NotImplementedException();
  }

  calculateDomesticDeliveryFee(request: CalculateDeliveryFee): Price {
    request.platformDomainName;
    return this.toPrice(0); // TODO
  }
}
