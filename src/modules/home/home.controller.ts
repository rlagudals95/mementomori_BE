import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { MallDto } from './malls.dto';

@ApiTags('home')
@Controller({
  path: 'home',
  version: '1',
})
export class HomeController {
  constructor(private homeService: HomeService) {}

  @ApiOperation({ summary: 'ohzig에서 바로가는 쇼핑몰 조회' })
  @Get('malls')
  async getShoppingMalls(): Promise<MallDto[]> {
    return this.homeService.getShoppingMalls();
  }
}
