import { Injectable, NotFoundException } from '@nestjs/common';
import { ScrapDto } from './models/scrap.dto';
import { ScrapType } from './models/scrap.model';
import { ScrapRepository } from './scrap.repository';

@Injectable()
export class ScrapService {
  constructor(private readonly scrapRepository: ScrapRepository) {}

  public async findOne(domain: string, type: ScrapType): Promise<ScrapDto> {
    const item = await this.scrapRepository.findOne(domain, type);

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
