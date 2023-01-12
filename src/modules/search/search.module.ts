import { Module } from '@nestjs/common';
import { TranslationService } from '@modules/translation/translation.service';
import { KeywordDictionaryRepository } from './keyword-dictionary.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, KeywordDictionaryRepository, TranslationService],
})
export class SearchModule {}
