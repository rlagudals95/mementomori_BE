import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { IndexType } from 'dynamoose/dist/Schema';
import { DataSource } from './exchange-rate.constant';

export const ExchangeRateSchema = new Schema(
  {
    yyyymmdd: {
      type: String,
      hashKey: true,
    },
    dataSource: {
      type: String,
      rangeKey: true,
      index: {
        name: 'dataSource-yyyymmdd-index',
        type: IndexType.global,
        rangeKey: 'yyyymmdd',
      },
    },
    exchangeRate: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            currencyCode: String,
            exchangeRate: Number,
            symbol: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

export class ExchangeRatePair {
  currencyCode: string;
  exchangeRate: number;
  symbol: string;
}

export class ExchangeRate extends Item {
  yyyymmdd: string;
  dataSource: DataSource;
  exchangeRate: ExchangeRatePair[];
}
