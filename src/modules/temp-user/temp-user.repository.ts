import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TEMP_USER_MAX_AGE_SECONDS } from './temp-user.constant';
import {
  CreateTempUser,
  TempUser,
  TempUserSchema,
  UpdateTempUser,
} from './temp-user.model';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class TempUserRepository extends BaseRepository<TempUser> {
  constructor(configService: ConfigService) {
    super('temp-user', configService);
  }

  getSchema() {
    return TempUserSchema;
  }

  getAddtionalOption() {
    return {
      expires: {
        attribute: 'ttl',
        ttl: TEMP_USER_MAX_AGE_SECONDS * 1000,
        items: {
          returnExpired: false,
        },
      },
    };
  }

  public async create(item: CreateTempUser): Promise<TempUser> {
    return this.model.create(item);
  }

  public async update(token: string, item: UpdateTempUser): Promise<TempUser> {
    return this.model.update({ token }, item);
  }

  public async findByToken(token: string): Promise<TempUser> {
    return this.model.get(token);
  }

  public async delete(token: string) {
    return this.model.delete({ token });
  }
}
