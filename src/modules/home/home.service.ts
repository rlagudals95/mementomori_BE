import { Injectable } from '@nestjs/common';
import { MallDto, malls } from './malls.dto';

@Injectable()
export class HomeService {
  public async getShoppingMalls(): Promise<MallDto[]> {
    return malls;
  }
}
