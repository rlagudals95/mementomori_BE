import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { deliveryFeeSchema } from '@modules/common/models/delivery-fee.schema';
import { priceSchema } from '@modules/common/models/price.schema';
import {
  Dimensions,
  Price,
  Weight,
} from '@modules/common/models/product.model';
import { DeliveryFee } from '@modules/delivery/fee/calculate-delivery-fee.dto';
import { Option } from './cart.model';

const weightSchema = {
  type: Object,
  schema: {
    unit: String,
    value: Number,
  },
};

const dimensionSchema = {
  type: Object,
  schema: {
    unit: String,
    width: Number,
    height: Number,
    depth: Number,
  },
};

const optionSchema = {
  type: Object,
  schema: {
    id: String,
    name: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            languageCode: String,
            value: String,
          },
        },
      ],
    },
    thumbnail: String,
    price: priceSchema,
    weight: weightSchema,
    dimensions: dimensionSchema,
  },
};

const cartSchemaPayload = {
  title: String,
  thumbnail: String,
  url: String,
  deliveryFee: deliveryFeeSchema,
  price: priceSchema,
  quantity: Number,
  country: String,
  platformDomainName: String,
  isSoldOut: Boolean,
  weight: weightSchema,
  dimensions: dimensionSchema,
  option: optionSchema,
};

export const CartSchema = new Schema(
  {
    userId: { type: String, hashKey: true },
    productId: {
      type: String,
      rangeKey: true,
    },
    ...cartSchemaPayload,
  },
  {
    timestamps: true,
  },
);

export const cartsSchema = {
  type: Array,
  schema: [
    {
      type: Object,
      schema: {
        ...cartSchemaPayload,
        userId: String,
        productId: String,
      },
    },
  ],
};

export class Cart extends Item {
  productId: string;
  title: string;
  thumbnail: string;
  url: string;
  deliveryFee?: DeliveryFee;
  price: Price;
  quantity: number;
  country: string; // 판매 국가
  platformDomainName: string; // 판매 플랫폼
  isSoldOut?: boolean; // 품절 여부
  weight: Weight;
  dimensions: Dimensions;
  option?: Option;
  createdAt: number;
  updatedAt: number;
}
