import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/jwt-auth.guard';
import { DeliveryService } from './delivery.service';
import { CalculateDeliveryFeeDto } from './fee/calculate-delivery-fee.dto';

@ApiTags('delivery')
@Controller({
  path: 'delivery',
  version: '1',
})
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Public()
  @Post('fee/calculate')
  @ApiOperation({ summary: '배송비 계산' })
  calculateDeliveryFee(
    @Body() calculateDeliveryFeeDto: CalculateDeliveryFeeDto,
  ) {
    return this.deliveryService.calculateDeliveryFee(calculateDeliveryFeeDto);
  }

  // @Get()
  // findAll() {
  //   return this.deliveryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.deliveryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
  //   return this.deliveryService.update(+id, updateDeliveryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.deliveryService.remove(+id);
  // }
}
