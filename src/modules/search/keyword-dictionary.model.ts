import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export const KeywordDictionarySchema = new Schema(
  {
    keyword: { type: String, hashKey: true },
    translatedKeywordLanguageCode: { type: String, rangeKey: true },
    keywordLanguageCode: String,
    translatedKeyword: String,
  },
  {
    timestamps: true,
  },
);

export interface KeywordDictionaryDto {
  keyword: string;
  keywordLanguageCode: string;
  translatedKeyword: string;
  translatedKeywordLanguageCode: string;
}

export class KeywordDictionary extends Item implements KeywordDictionaryDto {
  keyword: string;
  keywordLanguageCode: string;
  translatedKeyword: string;
  translatedKeywordLanguageCode: string;
}
