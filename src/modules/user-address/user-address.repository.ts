import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserAddress,
  UpdateUserAddress,
} from './models/user-address.dto';
import { UserAddress, UserAddressSchema } from './models/user-address.schema';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class UserAddressRepository extends BaseRepository<UserAddress> {
  constructor(configService: ConfigService) {
    super('user-address', configService);
  }

  getSchema() {
    return UserAddressSchema;
  }

  public async create(item: CreateUserAddress): Promise<UserAddress> {
    return this.model.create(item);
  }

  public async update(item: UpdateUserAddress): Promise<UserAddress> {
    return this.model.update(item);
  }

  public async findOne(
    userId: string,
    addressId: string,
  ): Promise<UserAddress> {
    return this.model.get({ userId, addressId });
  }

  public async findByUserId(userId: string): Promise<UserAddress[]> {
    return this.model.query({ userId }).exec();
  }

  public async delete(userId: string, addressId: string) {
    return this.model.delete({ userId, addressId });
  }
}
