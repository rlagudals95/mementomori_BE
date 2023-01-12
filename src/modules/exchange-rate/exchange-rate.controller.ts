import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/jwt-auth.guard';
import { CurrencyCode } from './models/exchange-rate.dto';
import { ExchangeRateService } from './exchange-rate.service';
import { Response } from 'express';

@ApiTags('exchange-rate')
@Controller({
  path: 'exchange-rate',
  version: '1',
})
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Public()
  @ApiOperation({ summary: '환율정보' })
  @ApiQuery({
    name: 'currencyCode',
    description: '환율코드',
    required: false,
    type: CurrencyCode,
  })
  @Get()
  async findAll(
    @Query() currencyCode: CurrencyCode,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.exchangeRateService.findAll(currencyCode);
    response.setHeader(
      'Expires',
      this.exchangeRateService.getNextUpdateDate().toISOString(),
    );
    return result;
  }
}
