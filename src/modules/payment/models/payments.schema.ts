import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export const PaymentSchema = new Schema(
  {
    orderId: { type: String, hashKey: true },
    paymentId: { type: String, rangeKey: true },
    pgName: String,
    pgOrderId: String,
    userId: String,
    payload: String,
  },
  {
    timestamps: true,
  },
);

export class Payment extends Item {
  orderId: string;
  paymentId: string;
  pgName: string;
  pgOrderId: string;
  userId: string;
  payload: string;
  createdAt: number;
  updatedAt: number;
}
