import { Injectable, NotFoundException } from '@nestjs/common';
import generateNoDashUUID from '@utils/uuid.util';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
  UserAddressDto,
} from './models/user-address.dto';
import { UserAddressRepository } from './user-address.repository';

@Injectable()
export class UserAddressService {
  constructor(private readonly userAddressRepository: UserAddressRepository) {}

  private createAddressId() {
    const idLength = 10;
    return generateNoDashUUID(idLength);
  }

  async create(
    createUserAddressDto: CreateUserAddressDto,
    userId: string,
  ): Promise<UserAddressDto> {
    try {
      return await this.userAddressRepository.create({
        ...createUserAddressDto,
        userId,
        addressId: this.createAddressId(),
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string): Promise<UserAddressDto[]> {
    try {
      const result = await this.userAddressRepository.findByUserId(userId);
      return result.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      throw error;
    }
  }

  async findOne(addressId: string, userId: string): Promise<UserAddressDto> {
    try {
      const item = await this.userAddressRepository.findOne(userId, addressId);
      if (!item) {
        throw new NotFoundException();
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(
    addressId: string,
    updateUserAddressDto: UpdateUserAddressDto,
    userId: string,
  ) {
    try {
      return await this.userAddressRepository.update({
        userId,
        addressId,
        ...updateUserAddressDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(addressId: string, userId: string) {
    try {
      return await this.userAddressRepository.delete(userId, addressId);
    } catch (error) {
      throw error;
    }
  }
}
