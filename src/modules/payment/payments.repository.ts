import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentSchema } from './models/payments.schema';
import { CreatePayment, UpdatePayment } from './models/payments.dto';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class PaymentsRepository extends BaseRepository<Payment> {
  constructor(configService: ConfigService) {
    super('payment', configService);
  }

  getSchema() {
    return PaymentSchema;
  }

  public async create(item: CreatePayment): Promise<Payment> {
    return this.model.create(item);
  }

  public async update(item: UpdatePayment): Promise<Payment> {
    return this.model.update(item);
  }

  public async findOne(orderId: string, paymentId: string): Promise<Payment> {
    return this.model.get({ orderId, paymentId });
  }

  public async findByOrderId(orderId: string): Promise<Payment[]> {
    return this.model.query({ orderId }).exec();
  }

  public async delete(orderId: string, paymentId: string) {
    return this.model.delete({ orderId, paymentId });
  }
}
