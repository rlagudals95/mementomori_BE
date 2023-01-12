import { Injectable } from '@nestjs/common';
import {
  CreateTempUser,
  TempUserDto,
  toDto,
  UpdateTempUser,
} from './temp-user.model';
import { TempUserRepository } from './temp-user.repository';

@Injectable()
export class TempUserService {
  constructor(private tempUserRepository: TempUserRepository) {}

  public async createUser(item: CreateTempUser): Promise<TempUserDto> {
    const user = await this.tempUserRepository.create(item);
    return toDto(user);
  }

  public async getUser(token: string): Promise<TempUserDto> {
    const user = await this.tempUserRepository.findByToken(token);
    return toDto(user);
  }

  public async updateUser(
    token: string,
    updateUser: UpdateTempUser,
  ): Promise<TempUserDto> {
    try {
      return await this.tempUserRepository.update(token, updateUser);
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(token: string) {
    return this.tempUserRepository.delete(token);
  }
}
