import { ConfigService } from '@nestjs/config';
import dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { Item } from 'dynamoose/dist/Item';
import { Schema } from 'dynamoose/dist/Schema';
import { TableOptionsOptional } from 'dynamoose/dist/Table';
import { ICreateTable } from './interface/create-table.interface';
import {
  TransactionProvidable,
  TransactionType,
} from './interface/transaction.interface';

export abstract class BaseRepository<T extends Item>
  implements ICreateTable, TransactionProvidable
{
  private readonly tablePrefix: string;
  private readonly _model: ModelType<T>;
  private readonly defaultOption = { throughput: 'ON_DEMAND' };

  constructor(
    private readonly tableName: string,
    configService: ConfigService,
  ) {
    this.tablePrefix = configService.get('DYNAMODB_TABLE_PREFIX');
    this._model = dynamoose.model<T>(this.getTableName(), this.getSchema(), {
      ...this.getOption(),
      create: false,
    });
  }

  abstract getSchema(): Schema;

  getOption(): TableOptionsOptional {
    return Object.assign(this.defaultOption, this.getAddtionalOption());
  }

  getAddtionalOption(): TableOptionsOptional {
    return {};
  }

  get model(): ModelType<T> {
    return this._model;
  }

  getTableName(): string {
    return this.tablePrefix + '-' + this.tableName;
  }

  get transaction(): TransactionType {
    return this.model.transaction;
  }

  public async createTable() {
    try {
      new dynamoose.Table(this.getTableName(), [this.model], this.getOption());
      console.log(`Table[${this.getTableName()}] created.`);
    } catch (e) {
      console.warn(e.message);
    }
  }
}
