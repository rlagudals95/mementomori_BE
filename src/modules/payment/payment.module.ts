<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
=======
import { CartRepository } from '@modules/cart/cart.repository';
import { OrderRepository } from '@modules/order/order.repository';
import { Module } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { TossPaymentsController } from './toss/toss-payments.controller';
import { TossPaymentsService } from './toss/toss-payments.service';

@Module({
  controllers: [TossPaymentsController],
  providers: [
    TossPaymentsService,
    PaymentsRepository,
    OrderRepository,
    CartRepository,
  ],
>>>>>>> e718cfea25fb562aeb66505e17e105e275227a1e
})
export class PaymentModule {}
