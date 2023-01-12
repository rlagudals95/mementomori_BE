import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import retryIf from '@utils/retry-axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { TRANSLATION_PLATFORM } from './translation.constant';
import {
  TranslateTextDto,
  TranslatedTextDto,
  BabelTranslateTextResponse,
} from './translation.dto';

@Injectable()
export class TranslationService {
  private baseUrl: string;

  public constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {
    const domain = configService.get('BABEL_NODE_URL');
    this.baseUrl = `http://${domain}`;
  }

  public async translateText(
    request: TranslateTextDto[],
  ): Promise<TranslatedTextDto[]> {
    // TODO: validation

    const promises = Array.from(request).map(async (req) => {
      const updatedRequest = {
        text: req.text,
        originLanguage: req.sourceLanguageCode,
        targetLanguage: req.targetLanguageCode,
        serviceId: 1004,
        platforms: [TRANSLATION_PLATFORM.GCP],
        cached: true,
        userId: '0',
      };
      const url = `${this.baseUrl}/v1/text/translation`;
      const result: BabelTranslateTextResponse = await retryIf(
        'POST',
        url,
        updatedRequest,
      );
      return {
        requestId: req.requestId,
        text: result.targets[0].text,
        languageCode: result.targets[0].language,
      };
    });

    const results = await Promise.allSettled(promises);

    return results.reduce((acc, item) => {
      if (item.status === 'fulfilled') {
        acc.push(item.value);
      } else if (item.status === 'rejected') {
        this.logger.error(
          `Translation request failed. ${item?.reason?.message}`,
        );
      }
      return acc;
    }, []);
  }
}
