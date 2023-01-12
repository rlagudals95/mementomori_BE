import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUser, User, UserSchema, UpdateUser } from './user.model';
import { BaseRepository } from '@modules/common/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(configService: ConfigService) {
    super('user', configService);
  }

  getSchema() {
    return UserSchema;
  }

  public async create(item: CreateUser): Promise<User> {
    return this.model.create(item);
  }

  public async update(userId: string, item: UpdateUser): Promise<User> {
    return this.model.update({ id: userId }, item);
  }

  public async findById(id: string): Promise<User> {
    return this.model.get(id);
  }

  public async findByEmail(email: string): Promise<User[]> {
    return this.model.query({ email }).exec();
  }
}
