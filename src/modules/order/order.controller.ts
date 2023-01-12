import { LoginedUser } from '@modules/auth/auth.interface';
import { GetLoginedUser } from '@modules/auth/jwt.strategy';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderDto } from './models/order.dto';
import { OrderService } from './order.service';
import { ConflictPCCCException } from './models/order.error';

@ApiTags('order')
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'order 생성' })
  @ApiConflictResponse({
    type: ConflictPCCCException,
    description: '등록된 개인통관부호가 수령인의 이름, 전화번호와 불일치',
  })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.orderService.create(loginedUser.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'order 전체 조회' })
  findAll(@GetLoginedUser() loginedUser: LoginedUser) {
    return this.orderService.findAll(loginedUser.id);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'order 개별 조회' })
  @ApiParam({ name: 'orderId', type: 'string' })
  findOne(
    @Param('orderId') orderId: string,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.orderService.findOne(loginedUser.id, orderId);
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'order 갱신' })
  @ApiParam({ name: 'orderId', type: 'string' })
  update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.orderService.update(loginedUser.id, orderId, updateOrderDto);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'order 삭제' })
  @ApiParam({ name: 'orderId', type: 'string' })
  remove(
    @Param('orderId') orderId: string,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.orderService.remove(loginedUser.id, orderId);
  }
}
