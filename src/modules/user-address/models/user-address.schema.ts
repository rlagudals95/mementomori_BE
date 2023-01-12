import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

const userAddressSchemaPayload = {
  displayName: String,
  recipientName: String,
  recipientPhone: String,
  countryCode: String,
  zipCode: String,
  address1: String,
  address2: String,
  deliveryRequest: String,
};

export const UserAddressSchema = new Schema(
  {
    userId: { type: String, hashKey: true },
    addressId: {
      type: String,
      rangeKey: true,
    },
    ...userAddressSchemaPayload,
  },
  {
    timestamps: true,
  },
);

export const userAddressSchema = {
  type: Object,
  schema: {
    ...userAddressSchemaPayload,
    userId: String,
    addressId: String,
  },
};

export class UserAddress extends Item {
  userId: string;
  addressId: string;
  displayName: string;
  recipientName: string;
  recipientPhone: string;
  countryCode: string;
  zipCode: string;
  address1: string;
  address2: string;
  deliveryRequest?: string;
  createdAt: number;
  updatedAt: number;
}
