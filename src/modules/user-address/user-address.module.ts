import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddressRepository } from './user-address.repository';

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService, UserAddressRepository],
  exports: [UserAddressRepository],
})
export class UserAddressModule {}
