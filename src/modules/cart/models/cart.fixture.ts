import {
  LengthUnit,
  WeightUnit,
} from '@modules/common/models/product.constant';
import { createDeliveryFee } from '@modules/delivery/fee/delivery-fee-calculation.util';
import { CreateCart } from './cart.dto';

export function createDummyCart(userId: string, productId: string): CreateCart {
  return {
    userId,
    productId,
    title: 'good product',
    thumbnail: '',
    url: 'http://good.product.com/good',
    deliveryFee: createDeliveryFee('USD', 0, 1, 0),
    price: { currencyCode: 'USD', amount: 100 },
    quantity: 2,
    country: 'US',
    platformDomainName: 'www.amazon.com',
    weight: {
      unit: WeightUnit.LB,
      value: 0,
    },
    dimensions: {
      unit: LengthUnit.IN,
      width: 0,
      height: 0,
      depth: 0,
    },
  };
}

export function getCartDummies(): CreateCart[] {
  const userId = 'test/id';
  return [
    createDummyCart(userId, '11111111'),
    createDummyCart(userId, '22222222'),
    createDummyCart(userId, '33333333'),
  ];
}
