import { StartedDockerComposeEnvironment } from 'testcontainers';
import { ExchangeRateRepository } from './exchange-rate.repository';
import { DataSource } from './models/exchange-rate.constant';
import { CreateExchangeRate } from './models/exchange-rate.dto';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';

describe.skip('ExchangeRateRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: ExchangeRateRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(ExchangeRateRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    await repository.create({
      yyyymmdd: '20221122',
      dataSource: DataSource.KOREAEXIM,
      exchangeRate: [
        {
          currencyCode: '',
          exchangeRate: 0,
          symbol: '$',
        },
      ],
    });
  });

  it('test update', async () => {
    const item = {
      yyyymmdd: '20221122',
      dataSource: DataSource.KOREAEXIM,
      exchangeRate: [
        {
          currencyCode: 'USD',
          exchangeRate: 1365.82,
          symbol: '$',
        },
      ],
    };
    await repository.create(item);

    const expectedExchangeRate = 1100.12;
    item.exchangeRate[0].exchangeRate = expectedExchangeRate;
    const actual = await repository.update(item);
    expect(actual.exchangeRate[0].exchangeRate).toBe(expectedExchangeRate);
  });

  it('test get', async () => {
    const items: CreateExchangeRate[] = [
      {
        yyyymmdd: '20221122',
        dataSource: DataSource.KOREAEXIM,
        exchangeRate: [
          {
            currencyCode: 'USD',
            exchangeRate: 10,
            symbol: '$',
          },
        ],
      },
    ];

    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findOne(
      items[0].yyyymmdd,
      items[0].dataSource,
    );

    expect(actual.yyyymmdd).toBe(items[0].yyyymmdd);
    expect(actual.dataSource).toBe(items[0].dataSource);
    expect(actual.exchangeRate[0].currencyCode).toBe(
      items[0].exchangeRate[0].currencyCode,
    );
  });

  it('test findByYyyyMmDd', async () => {
    const items: CreateExchangeRate[] = [
      {
        yyyymmdd: '20221122',
        dataSource: DataSource.KOREAEXIM,
        exchangeRate: [
          {
            currencyCode: 'USD',
            exchangeRate: 1365.82,
            symbol: '$',
          },
        ],
      },
      {
        yyyymmdd: '20221123',
        dataSource: DataSource.KOREAEXIM,
        exchangeRate: [
          {
            currencyCode: 'JPY(100)',
            exchangeRate: 961.47,
            symbol: '¥',
          },
        ],
      },
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByYyyyMmDd(items[0].yyyymmdd);
    expect(actual.length).toBe(1);
  });
});
