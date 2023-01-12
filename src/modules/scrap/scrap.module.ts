import { Module } from '@nestjs/common';
import { ScrapController } from './scrap.controller';
import { ScrapRepository } from './scrap.repository';
import { ScrapService } from './scrap.service';

@Module({
  controllers: [ScrapController],
  providers: [ScrapService, ScrapRepository],
})
export class ScrapModule {}
