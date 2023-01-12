import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { CreateScrap } from './models/scrap.dto';
import { createDummyScrap } from './models/scrap.fixture';
import { ScrapType } from './models/scrap.model';
import { ScrapRepository } from './scrap.repository';

describe.skip('ScrapRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: ScrapRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(ScrapRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    const item: CreateScrap = createDummyScrap(
      'www.amazon.com',
      ScrapType.PRODUCT,
      'https://assets.ohzig.com/js/scrap/product/amazon-d8c8450a7f9ea3615301.min.js',
    );

    const actual = await repository.create(item);

    expect(actual.domain).toBe(item.domain);
    expect(actual.type).toBe(item.type);
    expect(actual.url).toBe(item.url);
  });

  it('test findOne', async () => {
    const item: CreateScrap = createDummyScrap(
      'www.amazon.com',
      ScrapType.PRODUCT,
      'https://assets.ohzig.com/js/scrap/product/amazon-d8c8450a7f9ea3615301.min.js',
    );

    await repository.create(item);

    const actual = await repository.findOne(item.domain, item.type);

    expect(actual.domain).toBe(item.domain);
    expect(actual.type).toBe(item.type);
    expect(actual.url).toBe(item.url);
  });
});
