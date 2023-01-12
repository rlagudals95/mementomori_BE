import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLoginedUser } from '@modules/auth/jwt.strategy';
import { LoginedUser } from '@modules/auth/auth.interface';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './models/user-address.dto';

@ApiTags('user')
@Controller({
  path: 'user/addresses',
  version: '1',
})
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @ApiOperation({ summary: '배송 주소 추가' })
  @Post()
  create(
    @GetLoginedUser() loginedUser: LoginedUser,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    return this.userAddressService.create(createUserAddressDto, loginedUser.id);
  }

  @ApiOperation({ summary: '배송 주소 정보 전체 조회' })
  @Get()
  async findAll(@GetLoginedUser() loginedUser: LoginedUser) {
    return await this.userAddressService.findAll(loginedUser.id);
  }

  @ApiOperation({ summary: '배송 주소 정보 조회' })
  @Get(':id')
  findOne(@Param('id') id: string, @GetLoginedUser() loginedUser: LoginedUser) {
    return this.userAddressService.findOne(id, loginedUser.id);
  }

  @ApiOperation({ summary: '배송 주소 수정' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
    @GetLoginedUser() loginedUser: LoginedUser,
  ) {
    return this.userAddressService.update(
      id,
      updateUserAddressDto,
      loginedUser.id,
    );
  }

  @ApiOperation({ summary: '배송 주소 삭제' })
  @Delete(':id')
  remove(@Param('id') id: string, @GetLoginedUser() loginedUser: LoginedUser) {
    return this.userAddressService.delete(id, loginedUser.id);
  }
}
