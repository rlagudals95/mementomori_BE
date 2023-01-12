import { PartialType } from '@nestjs/swagger';
import { Payment } from './payments.schema';

export class PaymentDto extends PartialType(Payment) {}

export class CreatePayment {
  orderId: string;
  paymentId: string;
  pgName: string;
  pgOrderId: string;
  userId: string;
  payload: string;
}

export class UpdatePayment extends PartialType(CreatePayment) {}
