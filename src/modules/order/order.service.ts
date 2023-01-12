import { ApiErrorCode } from '@errors/api-error.enum';
import { ApiConflictException } from '@errors/api.exception';
import { CartRepository } from '@modules/cart/cart.repository';
import { CustomsService } from '@modules/customs/customs.service';
import { UserAddressRepository } from '@modules/user-address/user-address.repository';
import { UserRepository } from '@modules/user/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import generateNoDashUUID from '@utils/uuid.util';
import { instanceToPlain } from 'class-transformer';
import { CreateOrderDto, OrderDto, UpdateOrderDto } from './models/order.dto';
import { OrderStatus } from './models/order.model';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly userAddressRepository: UserAddressRepository,
    private readonly userRepository: UserRepository,
    private readonly customsService: CustomsService,
  ) {}

  private createOrderId() {
    const idLength = 10;
    return generateNoDashUUID(idLength);
  }

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    const carts = await this.cartRepository.findMany(
      userId,
      createOrderDto.productIds,
    );

    if (createOrderDto.productIds.length !== carts?.length) {
      throw new BadRequestException('Requested order contains invalid cartId');
    }

    const address = await this.userAddressRepository.findOne(
      userId,
      createOrderDto.addressId,
    );

    if (!address) {
      throw new BadRequestException(
        'Requested order contains invalid addressId',
      );
    }

    // TODO: BE에서 계산한 carts의 총 금액이 FE에서 계산한 값과 크게 차이가 없는지 validation

    const user = await this.userRepository.findById(userId);
    const validationResult = await this.customsService.validatePCCC({
      phone: address.recipientPhone,
      name: address.recipientName,
      pccc: user.PCCC,
    });

    if (!validationResult.success) {
      throw new ApiConflictException(ApiErrorCode.CONFLICT_PCCC);
    }

    const result = await this.orderRepository.create({
      userId,
      orderId: this.createOrderId(),
      carts: instanceToPlain(carts) as OrderDto[],
      address: instanceToPlain(address),
      status: OrderStatus.DRAFT,
    });

    return result;
  }

  async findAll(userId: string): Promise<OrderDto[]> {
    const result = await this.orderRepository.findByUserId(userId);
    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async findOne(userId: string, orderId: string): Promise<OrderDto> {
    const item = await this.orderRepository.findOne(userId, orderId);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  async update(
    userId: string,
    orderId: string,
    updateCartDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderRepository.update({
      ...updateCartDto,
      userId,
      orderId,
    });
  }

  async remove(userId: string, orderId: string) {
    await this.orderRepository.delete(userId, orderId);
  }
}
