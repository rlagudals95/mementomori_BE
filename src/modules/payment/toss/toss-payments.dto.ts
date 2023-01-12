import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentConfirmationDto {
  @IsString()
  @IsNotEmpty()
  customerKey: string;

  @IsString()
  @IsNotEmpty()
  paymentKey: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  pgOrderId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
