import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { ScrapType } from './scrap.model';

export const ScrapSchema = new Schema(
  {
    domain: { type: String, hashKey: true, required: true },
    type: {
      type: String,
      rangeKey: true,
      required: true,
    },
    url: { type: String, required: false, default: '' },
  },
  {
    timestamps: true,
  },
);

export class Scrap extends Item {
  domain: string;
  type: ScrapType;
  url: string;
}
