import { Public } from '@modules/auth/jwt-auth.guard';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getDomain } from '@utils/domain.util';
import { GetScrapDto, ScrapDto } from './models/scrap.dto';
import { ScrapType } from './models/scrap.model';
import { ScrapService } from './scrap.service';

@ApiTags('scrap')
@Controller({
  path: 'scrap',
  version: '1',
})
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'scrap js 코드 조회' })
  @ApiQuery({
    name: 'domain',
    description: '도메인',
    required: true,
    type: String,
    example: 'www.amazon.com',
  })
  @ApiQuery({
    name: 'type',
    description: '종류',
    required: true,
    enum: ScrapType,
    example: [ScrapType.PRODUCT, ScrapType.SEARCH],
  })
  findOne(@Query() getScrapDTO: GetScrapDto): Promise<ScrapDto> {
    const domain = getDomain(getScrapDTO.domain);

    return this.scrapService.findOne(domain, getScrapDTO.type);
  }
}
