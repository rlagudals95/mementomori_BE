import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import generateNoDashUUID from '@utils/uuid.util';
import { DeliverySpeed } from '@modules/delivery/delivery.constant';
import { DeliveryFeeCalculator } from '@modules/delivery/fee/delivery-fee-calculator';
import { CartRepository } from './cart.repository';
import { CartDto, CreateCartDto, UpdateCartDto } from './models/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly deliveryFeeCalculator: DeliveryFeeCalculator,
  ) {}

  private createCartId() {
    const idLength = 10;
    return generateNoDashUUID(idLength);
  }

  async create(
    userId: string,
    productId: string,
    createCartDto: CreateCartDto,
  ): Promise<CartDto> {
    const allowedCountryCodes =
      this.deliveryFeeCalculator.getSupportedCountryCode();
    if (!allowedCountryCodes.includes(createCartDto.country)) {
      throw new BadRequestException(
        `allowed value for country: ${allowedCountryCodes}`,
      );
    }

    try {
      const calculated = this.deliveryFeeCalculator.calculate({
        ...createCartDto,
        deliveryFrom: createCartDto.country,
        deliverySpeed: DeliverySpeed.STANDARD,
        productPrice: createCartDto.price,
      });
      return await this.cartRepository.create({
        ...createCartDto,
        userId,
        productId,
        deliveryFee: calculated.deliveryFee,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string): Promise<CartDto[]> {
    try {
      // 장바구니 정렬: 국가 오름차순 > 플랫폼 오름차순 > 최신에 추가/갱신 내림차순
      const result = await this.cartRepository.findByUserId(userId);
      return result.sort(
        (a, b) =>
          a.country.localeCompare(b.country) ||
          a.platformDomainName.localeCompare(b.platformDomainName) ||
          b.updatedAt - a.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, productId: string): Promise<CartDto> {
    try {
      const item = await this.cartRepository.findOne(userId, productId);
      if (!item) {
        throw new NotFoundException();
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: string,
    productId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDto> {
    try {
      return await this.cartRepository.update({
        userId,
        productId,
        ...updateCartDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, productId: string) {
    try {
      await this.cartRepository.delete(userId, productId);
    } catch (error) {
      throw error;
    }
  }
}
