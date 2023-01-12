import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller({
  path: 'payment',
  version: '1',
})
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Public()
  @Get('auth')
  @ApiOperation({ summary: 'toss 결제 인증' })
  async auth(
    @Query('code') code: string,
    @Query('customerKey') customerKey: string,
  ) {
    return await this.paymentService.auth(code, customerKey);
  }
}
