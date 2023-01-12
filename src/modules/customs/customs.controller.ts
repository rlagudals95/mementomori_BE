import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeneralResultDto } from '@modules/common/models/common.dto';
import { ValidatePCCCDto } from './customs.dto';
import { CustomsService } from './customs.service';

@ApiTags('customs')
@Controller({
  path: 'customs',
  version: '1',
})
export class CustomsController {
  constructor(private readonly customsService: CustomsService) {}

  @Post('pccc/validation')
  @ApiOperation({
    summary: '개인통관부호(Personal Customs Clearance Code) 검증',
  })
  async calculateDeliveryFee(
    @Body() validatePCCCDto: ValidatePCCCDto,
  ): Promise<GeneralResultDto> {
    return this.customsService.validatePCCC(validatePCCCDto);
  }
}
