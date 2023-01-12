import { toDto } from '@modules/common/dto.util';
import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser, UserDto } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async createUser(item: CreateUser): Promise<UserDto> {
    try {
      const user = await this.userRepository.create(item);
      return toDto(UserDto, user);
    } catch (error) {
      throw error;
    }
  }

  public async getUser(userId: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(userId);
      return toDto(UserDto, user);
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(
    userId: string,
    updateUser: UpdateUser,
  ): Promise<UserDto> {
    try {
      const user = this.userRepository.update(userId, updateUser);
      return toDto(UserDto, user);
    } catch (error) {
      throw error;
    }
  }
}
