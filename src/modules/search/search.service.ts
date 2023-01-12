import { Injectable } from '@nestjs/common';
import { TranslatedKeywordDto } from './search.dto';
import { KeywordDictionaryRepository } from './keyword-dictionary.repository';
import { TranslationService } from '@modules/translation/translation.service';

@Injectable()
export class SearchService {
  constructor(
    private keywordDictionaryRepository: KeywordDictionaryRepository,
    private translationService: TranslationService,
  ) {}

  public async translateKeyword(
    keyword: string,
  ): Promise<TranslatedKeywordDto[]> {
    // TODO: 사용자가 검색어를 못찾은경우를 어떻게 식별할 것인가

    const keyDicResult = await this.keywordDictionaryRepository.query(keyword);
    if (keyDicResult.length) {
      return keyDicResult.map((k) => ({
        languageCode: k.translatedKeywordLanguageCode,
        keyword: k.translatedKeyword,
      }));
    }

    try {
      const request = ['en', 'ja', 'zh'].map((targetLanguageCode) => ({
        requestId: '1234',
        text: keyword,
        sourceLanguageCode: 'ko',
        targetLanguageCode,
      }));

      const translatedKeywords = await this.translationService.translateText(
        request,
      );
      return translatedKeywords.map((k) => {
        return {
          languageCode: k.languageCode,
          keyword: k.text,
        };
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
