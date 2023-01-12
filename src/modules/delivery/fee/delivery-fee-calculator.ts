import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CalculateDeliveryFeeDto,
  DeliveryFeeDto,
} from './calculate-delivery-fee.dto';
import { DeliveryFeeCalculatable } from './delivery-fee-calculatorable.interface';
import { DeliveryFeeCalculatorUSA } from './delivery-fee-calculator-usa';
import { DeliveryFeeCalculatorChina } from './delivery-fee-calculator-china';

@Injectable()
export class DeliveryFeeCalculator {
  readonly calculators: Map<string, DeliveryFeeCalculatable>;
  readonly commisionRate = 0.05;

  constructor(
    private readonly deliveryFeeCalculatorUSA: DeliveryFeeCalculatorUSA,
    private readonly deliveryFeeCalculatorChina: DeliveryFeeCalculatorChina,
  ) {
    this.calculators = new Map([
      [deliveryFeeCalculatorUSA.getCountryCode(), deliveryFeeCalculatorUSA],
      [deliveryFeeCalculatorChina.getCountryCode(), deliveryFeeCalculatorChina],
    ]);
  }

  getSupportedCountryCode(): string[] {
    return Array.from(this.calculators.keys());
  }

  calculate(requestDto: CalculateDeliveryFeeDto): DeliveryFeeDto {
    const calculator = this.calculators.get(requestDto.deliveryFrom);

    if (requestDto.productPrice.currencyCode !== calculator.getCurrencyCode()) {
      throw new BadRequestException(
        `allowed value for productPrice.currencyCode: ${calculator.getCurrencyCode()}`,
      );
    }

    const deliveryFee = {
      local: calculator.calculateShopLocalDelivery(requestDto),
      international: calculator.calculateInternationalDelivery(requestDto),
      domestic: calculator.calculateDomesticDeliveryFee(requestDto),
    };
    const dutyAndTax = { currencyCode: 'KRW', amount: 0 }; // TODO:
    const productPrice = requestDto.productPrice;
    const commission = {
      currencyCode: productPrice.currencyCode,
      amount: productPrice.amount * requestDto.quantity * this.commisionRate,
    };
    return {
      deliveryFee,
      dutyAndTax,
      commission,
    };
  }
}
