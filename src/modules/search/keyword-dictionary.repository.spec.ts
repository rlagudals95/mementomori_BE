import { KeywordDictionaryRepository } from './keyword-dictionary.repository';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';

describe.skip('KeywordDictionaryRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: KeywordDictionaryRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(KeywordDictionaryRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    await repository.create({
      keyword: '돌돌이',
      keywordLanguageCode: 'ko',
      translatedKeyword: 'dust roller',
      translatedKeywordLanguageCode: 'en',
    });
  });

  it('test query', async () => {
    const items = [
      {
        keyword: '돌돌이',
        keywordLanguageCode: 'ko',
        translatedKeyword: 'dust roller',
        translatedKeywordLanguageCode: 'en',
      },
      {
        keyword: '돌돌이',
        keywordLanguageCode: 'ko',
        translatedKeyword: 'テープクリーナー',
        translatedKeywordLanguageCode: 'ja',
      },
      {
        keyword: '돌돌이',
        keywordLanguageCode: 'ko',
        translatedKeyword: '滚刷',
        translatedKeywordLanguageCode: 'cn',
      },
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.query(items[0].keyword);
    expect(actual.length).toBe(3);
  });
});
