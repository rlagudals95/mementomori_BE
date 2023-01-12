import convert from 'convert';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { DeliverySpeed } from '../delivery.constant';
import { WeightUnit } from '@modules/common/models/product.constant';
import {
  ceiling,
  createPriceFactory,
  isOversized,
  round5,
} from './delivery-fee-calculation.util';
import {
  CalculateDeliveryFee,
  DeliveryFeeCalculatable,
} from './delivery-fee-calculatorable.interface';
import { Price } from '@modules/common/models/product.model';

@Injectable()
export class DeliveryFeeCalculatorUSA implements DeliveryFeeCalculatable {
  toPrice = createPriceFactory(this.getCurrencyCode());

  getCountryCode(): string {
    return 'US';
  }

  getCurrencyCode(): string {
    return 'USD';
  }

  calculateShopLocalDelivery(request: CalculateDeliveryFee): Price {
    request.platformDomainName;
    return this.toPrice(0); // TODO
  }

  calculateInternationalDelivery(request: CalculateDeliveryFee): Price {
    if (!request.weight || request.weight.value <= 0) {
      // TODO: category나 product name을 통해서 예측
      return this.toPrice(0);
    }

    let weightInLb = convert(request.weight.value, request.weight.unit).to(
      WeightUnit.LB,
    );
    weightInLb = Math.ceil(weightInLb);

    if (request.deliverySpeed == DeliverySpeed.EXPEDITED) {
      // https://www.ohmyzip.com/how-it-works/shipping-fee/price-chart/?ship_from=DE&row=20&tabID=3&ship_to_search=KR&ship_to=KR&a=AIR&ship_method=AIR
      // 프라임
      const ohMyZip = 8.5 + (weightInLb - 1) * 1.7;
      const ohzig = ceiling(ohMyZip * 1.1, 0.5);
      const oversized = isOversized(request.dimensions) ? 5 : 0;
      const total = ohzig + oversized;
      return this.toPrice(total * request.quantity);
    } else if (request.deliverySpeed == DeliverySpeed.STANDARD) {
      const floored = round5(Math.max(weightInLb, 30));
      const ohMyZip = 11.5 + ((floored - 30) / 5) * 2;
      const total = ceiling(ohMyZip * 1.1, 0.5);
      return this.toPrice(total * request.quantity);
    }

    throw new NotImplementedException();
  }

  calculateDomesticDeliveryFee(request: CalculateDeliveryFee): Price {
    request.platformDomainName;
    return this.toPrice(0); // TODO
  }
}
