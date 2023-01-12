import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/jwt-auth.guard';
import { TempUserDto, UpdateTempUser } from './temp-user.model';
import { TempUserService } from './temp-user.service';
import { Request } from 'express';
import { TEMP_TOKEN_NAME } from './temp-user.constant';

@ApiTags('user')
@Controller({
  path: 'temp-user',
  version: '1',
})
export class TempUserController {
  constructor(private tempUserService: TempUserService) {}

  @Public()
  @ApiOperation({ summary: '임시 유저 정보 조회' })
  @Get()
  async get(@Req() request: Request): Promise<TempUserDto> {
    const token = request?.cookies[TEMP_TOKEN_NAME];
    if (!token) {
      throw new BadRequestException('empty tempToken');
    }
    const tempUser = await this.tempUserService.getUser(token);
    if (!tempUser) {
      throw new NotFoundException('User Not Found');
    }
    return tempUser;
  }

  @Public()
  @ApiOperation({ summary: '임시 유저 정보 업데이트' })
  @Post()
  async post(
    @Req() request: Request,
    @Body() updateUser: UpdateTempUser,
  ): Promise<any> {
    const token = request?.cookies[TEMP_TOKEN_NAME];
    if (!token) {
      throw new BadRequestException('empty tempToken');
    }
    this.tempUserService.updateUser(token, updateUser);
  }
}
