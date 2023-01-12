import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/jwt-auth.guard';
import { TranslatedKeywordDto } from './search.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @ApiOperation({ summary: '검색어 번역' })
  @ApiQuery({
    name: 'q',
    description: '검색 keyword',
    example: '돌돌이',
  })
  @Get('keyword')
  public getTranslatedKeyword(
    @Query('q') q: string,
  ): Promise<TranslatedKeywordDto[]> {
    return this.searchService.translateKeyword(q);
  }
}
