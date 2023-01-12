import { Module } from '@nestjs/common';
import { TempUserController } from './temp-user.controller';
import { TempUserRepository } from './temp-user.repository';
import { TempUserService } from './temp-user.service';

@Module({
  controllers: [TempUserController],
  providers: [TempUserRepository, TempUserService],
  exports: [TempUserService],
})
export class TempUserModule {}
