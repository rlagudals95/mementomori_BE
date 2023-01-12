import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseRepository } from '@modules/common/base.repository';
import { Scrap, ScrapSchema } from './models/scrap.schema';
import { ScrapType } from './models/scrap.model';
import { CreateScrap } from './models/scrap.dto';

@Injectable()
export class ScrapRepository extends BaseRepository<Scrap> {
  constructor(configService: ConfigService) {
    super('scrap', configService);
  }

  getSchema() {
    return ScrapSchema;
  }

  public async create(item: CreateScrap): Promise<Scrap> {
    return this.model.create(item);
  }

  public async findOne(domain: string, type: ScrapType): Promise<Scrap> {
    return this.model.get({ domain, type });
  }
}
