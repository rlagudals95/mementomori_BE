import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateExchangeRate,
  UpdateExchangeRate,
} from './models/exchange-rate.dto';
import {
  ExchangeRate,
  ExchangeRateSchema,
} from './models/exchange-rate.schema';
import { BaseRepository } from '@modules/common/base.repository';
import { DataSource } from './models/exchange-rate.constant';
import { SortOrder } from 'dynamoose/dist/General';

@Injectable()
export class ExchangeRateRepository extends BaseRepository<ExchangeRate> {
  constructor(configService: ConfigService) {
    super('exchange-rate', configService);
  }

  getSchema() {
    return ExchangeRateSchema;
  }

  public async create(item: CreateExchangeRate): Promise<ExchangeRate> {
    return this.model.create(item);
  }

  public async update(item: UpdateExchangeRate): Promise<ExchangeRate> {
    return this.model.update(item);
  }

  public async findOne(
    yyyymmdd: string,
    dataSource: string,
  ): Promise<ExchangeRate> {
    return this.model.get({ yyyymmdd, dataSource });
  }

  public async findByYyyyMmDd(yyyymmdd: string): Promise<ExchangeRate[]> {
    return this.model.query({ yyyymmdd }).exec();
  }

  public async findLatestByDataSource(
    dataSource: DataSource,
  ): Promise<ExchangeRate[]> {
    return this.model
      .query({ dataSource })
      .using('dataSource-yyyymmdd-index')
      .sort(SortOrder.descending)
      .limit(1)
      .exec();
  }
}
