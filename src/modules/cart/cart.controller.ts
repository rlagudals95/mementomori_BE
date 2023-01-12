import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginedUser } from '@modules/auth/auth.interface';
import { GetLoginedUser } from '@modules/auth/jwt.strategy';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './models/cart.dto';

@ApiTags('cart')
@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'cart 생성' })
  @ApiParam({ name: 'productId', type: 'string' })
  create(
    @Param('productId') productId: string,
    @Body() createCartDto: CreateCartDto,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.cartService.create(loginedUser.id, productId, createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'cart 전체 조회' })
  findAll(@GetLoginedUser() loginedUser: LoginedUser) {
    return this.cartService.findAll(loginedUser.id);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'cart 개별 조회' })
  @ApiParam({ name: 'productId', type: 'string' })
  findOne(
    @Param('productId') productId: string,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.cartService.findOne(loginedUser.id, productId);
  }

  @Put(':productId')
  @ApiOperation({ summary: 'cart 갱신' })
  @ApiParam({ name: 'productId', type: 'string' })
  update(
    @Param('productId') productId: string,
    @Body() updateCartDto: UpdateCartDto,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.cartService.update(loginedUser.id, productId, updateCartDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'cart 삭제' })
  @ApiParam({ name: 'productId', type: 'string' })
  remove(
    @Param('productId') productId: string,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.cartService.remove(loginedUser.id, productId);
  }
}
