import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderSchema } from './models/order.schema';
import { CreateOrder, UpdateOrder } from './models/order.dto';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(configService: ConfigService) {
    super('order', configService);
  }

  getSchema() {
    return OrderSchema;
  }

  public async create(item: CreateOrder): Promise<Order> {
    return this.model.create(item);
  }

  public async update(item: UpdateOrder): Promise<Order> {
    return this.model.update(item);
  }

  public async findOne(userId: string, orderId: string): Promise<Order> {
    return this.model.get({ userId, orderId });
  }

  public async findByUserId(userId: string): Promise<Order[]> {
    return this.model.query({ userId }).exec();
  }

  public async delete(userId: string, orderId: string) {
    return this.model.delete({ userId, orderId });
  }
}
