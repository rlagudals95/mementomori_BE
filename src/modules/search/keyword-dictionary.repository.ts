import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeywordDictionary,
  KeywordDictionaryDto,
  KeywordDictionarySchema,
} from './keyword-dictionary.model';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class KeywordDictionaryRepository extends BaseRepository<KeywordDictionary> {
  constructor(configService: ConfigService) {
    super('keyword-dictionary', configService);
  }

  getSchema() {
    return KeywordDictionarySchema;
  }

  public async create(
    item: KeywordDictionaryDto,
  ): Promise<KeywordDictionaryDto> {
    return this.model.create(item);
  }

  public async query(keyword: string): Promise<KeywordDictionaryDto[]> {
    return this.model.query({ keyword }).exec();
  }
}
