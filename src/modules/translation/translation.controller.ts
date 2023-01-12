import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/jwt-auth.guard';
import { TranslatedTextDto, TranslateTextDto } from './translation.dto';
import { TranslationService } from './translation.service';

@ApiTags('translation')
@Controller({ path: 'translation', version: '1' })
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Public()
  @ApiOperation({ summary: '텍스트 번역' })
  @ApiBody({
    type: TranslateTextDto,
    isArray: true,
  })
  @Post('text')
  public translateText(
    @Body(new ParseArrayPipe({ items: TranslateTextDto }))
    request: TranslateTextDto[],
  ): Promise<TranslatedTextDto[]> {
    return this.translationService.translateText(request);
  }
}
