import { Public } from '@modules/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentConfirmationDto } from './toss-payments.dto';
import { TossPaymentsService } from './toss-payments.service';

@ApiTags('payments')
@Controller({
  path: 'payments/toss',
  version: '1',
})
export class TossPaymentsController {
  constructor(private readonly tossPaymentsService: TossPaymentsService) {}

  @Public()
  @Get('auth-callback')
  @ApiOperation({ summary: '인증 처리' })
  @ApiQuery({
    name: 'code',
    description: '인증코드',
    type: String,
  })
  @ApiQuery({
    name: 'customerKey',
    description: '고객 key(ohzig user id)',
    type: String,
  })
  async processAuthCallback(
    @Query('code') code: string,
    @Query('customerKey') customerKey: string,
  ) {
    return await this.tossPaymentsService.processAuthCallback(
      code,
      customerKey,
    );
  }

  @Public()
  @Post('confirm')
  @ApiOperation({ summary: '결제 확인' })
  async confirm(@Body() paymentConfirmation: PaymentConfirmationDto) {
    return await this.tossPaymentsService.confirm(paymentConfirmation);
  }
}
