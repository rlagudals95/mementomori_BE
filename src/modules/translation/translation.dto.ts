import { IsNotEmpty } from 'class-validator';
import { IsISO6391 } from '@utils/iso639-1.decorator';
import { TRANSLATION_PLATFORM } from './translation.constant';

export class TranslateTextDto {
  @IsNotEmpty()
  requestId: string;

  @IsNotEmpty()
  text: string;

  @IsISO6391()
  sourceLanguageCode: string;

  @IsISO6391()
  targetLanguageCode: string;
}

export class TranslatedTextDto {
  requestId: string;
  text: string;
  languageCode: string;
}

export interface BabelTranslateTextResponse {
  serviceId: number;
  source: {
    text: string;
    language: string;
  };
  targets: {
    text: string;
    platform: TRANSLATION_PLATFORM;
    cached: boolean;
    language: string;
    createTime: number;
  }[];
  userId: string;
  createTime: number;
}
