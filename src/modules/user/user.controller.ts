import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginedUser } from '@modules/auth/auth.interface';
import { GetLoginedUser } from '@modules/auth/jwt.strategy';
import { UpdateUser, UserDto } from './user.model';
import { UserService } from './user.service';

@ApiTags('user')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 조회' })
  @Get('me')
  async get(@GetLoginedUser() loginedUser: LoginedUser): Promise<UserDto> {
    return this.userService.getUser(loginedUser.id);
  }

  @ApiOperation({ summary: '유저 정보 업데이트' })
  @Post('me')
  async post(
    @GetLoginedUser() loginedUser: LoginedUser,
    @Body() updateUser: UpdateUser,
  ): Promise<UserDto> {
    return this.userService.updateUser(loginedUser.id, updateUser);
  }
}
