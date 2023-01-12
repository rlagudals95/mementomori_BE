import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryFeeCalculator } from './fee/delivery-fee-calculator';
import { DeliveryFeeCalculatorUSA } from './fee/delivery-fee-calculator-usa';
import { DeliveryFeeCalculatorChina } from './fee/delivery-fee-calculator-china';

@Module({
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    DeliveryFeeCalculator,
    DeliveryFeeCalculatorUSA,
    DeliveryFeeCalculatorChina,
  ],
  exports: [DeliveryFeeCalculator],
})
export class DeliveryModule {}
