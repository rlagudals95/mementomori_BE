import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CalculateDeliveryFeeDto,
  DeliveryFeeDto,
} from './fee/calculate-delivery-fee.dto';
import { DeliveryFeeCalculator } from './fee/delivery-fee-calculator';

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryFeeCalculator: DeliveryFeeCalculator) {}

  public calculateDeliveryFee(
    requestDto: CalculateDeliveryFeeDto,
  ): DeliveryFeeDto {
    const allowedCountryCodes =
      this.deliveryFeeCalculator.getSupportedCountryCode();
    if (!allowedCountryCodes.includes(requestDto.deliveryFrom)) {
      throw new BadRequestException(
        `allowed value for deliveryFrom: ${allowedCountryCodes}`,
      );
    }

    return this.deliveryFeeCalculator.calculate(requestDto);
  }
}
