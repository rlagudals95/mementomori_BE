import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCart, UpdateCart } from './models/cart.dto';
import { Cart, CartSchema } from './models/cart.schema';
import { TransactionType } from '@modules/common/interface/transaction.interface';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
  private readonly maxCartItems = 200;
  private readonly ttl: number;

  constructor(configService: ConfigService) {
    super('cart', configService);
    const oneDayInMillis = 86400000;
    this.ttl = 90 * oneDayInMillis;
  }

  getAddtionalOption() {
    return {
      expires: { attribute: 'ttl', ttl: this.ttl },
    };
  }

  getSchema() {
    return CartSchema;
  }

  get transaction(): TransactionType {
    return this.model.transaction;
  }

  public async create(item: CreateCart): Promise<Cart> {
    const { userId, productId, quantity, ...rest } = item;
    const now = Date.now();
    const newItem = {
      ttl: (now + this.ttl) / 1000,
      createdAt: now,
      ...rest,
    };
    const model = this.model as any;
    const updated = await model.update(
      { userId, productId },
      { $SET: newItem, $ADD: { quantity: quantity } },
    );

    const countResponse = await this.model
      .query('userId')
      .eq(userId)
      .count()
      .exec();

    if (countResponse.count > this.maxCartItems) {
      const all: Cart[] = await this.model.query('userId').eq(userId).exec();
      const oldest = all
        .map((c) => ({ productId: c.productId, createdAt: c.createdAt }))
        .reduce((acc, item) => {
          return acc.createdAt < item.createdAt ? acc : item;
        });
      await this.model.delete({ userId, productId: oldest.productId });
    }

    return updated;
  }

  public async update(item: UpdateCart): Promise<Cart> {
    return this.model.update(item);
  }

  public async findOne(userId: string, productId: string): Promise<Cart> {
    return this.model.get({ userId, productId });
  }

  public async findMany(userId: string, productIds: string[]): Promise<Cart[]> {
    const keys = productIds.map((productId) => ({ userId, productId }));
    return this.model.batchGet(keys);
  }

  public async findByUserId(userId: string): Promise<Cart[]> {
    return this.model.query({ userId }).exec();
  }

  public async delete(userId: string, productId: string) {
    return this.model.delete({ userId, productId });
  }

  public async deleteMany(userId: string, productIds: string[]) {
    const keys = productIds.map((productId) => ({ userId, productId }));
    return this.model.batchDelete(keys);
  }
}
