import { StartedDockerComposeEnvironment } from 'testcontainers';
import { CartRepository } from './cart.repository';
import { CreateCart } from './models/cart.dto';
import {
  LengthUnit,
  WeightUnit,
} from '@modules/common/models/product.constant';
import { createDeliveryFee } from '@modules/delivery/fee/delivery-fee-calculation.util';
import { getCartDummies } from './models/cart.fixture';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';

describe.skip('CartRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: CartRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(CartRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    await repository.create({
      userId: 'test/id',
      productId: '123456789',
      title: 'good product',
      thumbnail: '',
      url: 'http://good.product.com/good',
      deliveryFee: createDeliveryFee('USD', 0, 1, 0),
      price: { currencyCode: 'USD', amount: 100 },
      quantity: 2,
      country: 'US',
      platformDomainName: 'www.amazon.com',
      isSoldOut: false,
      weight: {
        unit: WeightUnit.LB,
        value: 0,
      },
      dimensions: {
        unit: LengthUnit.IN,
        width: 0,
        height: 0,
        depth: 0,
      },
      option: {
        id: 'opt1',
        name: [
          {
            languageCode: 'en',
            value: 'option name en',
          },
          {
            languageCode: 'ko',
            value: '옵션 이름 한글',
          },
        ],
        price: { currencyCode: 'CNY', amount: 0 },
        thumbnail: 'http://adsfa',
        weight: {
          unit: WeightUnit.LB,
          value: 0,
        },
        dimensions: {
          unit: LengthUnit.IN,
          width: 0,
          height: 0,
          depth: 0,
        },
      },
    });
  });

  it('장바구니에 동일한 상품이 들어있는 경우 수량만 merge(increment) 한다.', async () => {
    const item: CreateCart = {
      userId: 'test/id',
      productId: '123456789',
      title: 'good product',
      thumbnail: '',
      url: 'http://good.product.com/good',
      deliveryFee: createDeliveryFee('USD', 0, 1, 0),
      price: { currencyCode: 'USD', amount: 100 },
      quantity: 2,
      country: 'US',
      platformDomainName: 'www.amazon.com',
      isSoldOut: false,
      weight: {
        unit: WeightUnit.LB,
        value: 0,
      },
      dimensions: {
        unit: LengthUnit.IN,
        width: 0,
        height: 0,
        depth: 0,
      },
    };

    await repository.create(item);
    await repository.create(item);

    const actual = await repository.findOne(item.userId, item.productId);

    expect(actual.productId).toBe(item.productId);
    expect(actual.title).toBe(item.title);
    expect(actual.quantity).toBe(4);
  });

  it('test update', async () => {
    const item: CreateCart = {
      userId: 'test/id',
      productId: '123456789',
      title: 'good product',
      thumbnail: '',
      url: 'http://good.product.com/good',
      deliveryFee: createDeliveryFee('USD', 0, 1, 0),
      price: { currencyCode: 'USD', amount: 100 },
      quantity: 2,
      country: 'US',
      platformDomainName: 'www.amazon.com',
      isSoldOut: false,
      weight: {
        unit: WeightUnit.LB,
        value: 0,
      },
      dimensions: {
        unit: LengthUnit.IN,
        width: 0,
        height: 0,
        depth: 0,
      },
    };
    await repository.create(item);

    const expectedTitle = 'bad product';
    item.title = expectedTitle;
    const actual = await repository.update(item);

    expect(actual.title).toBe(expectedTitle);
  });

  it('test delete', async () => {
    const item: CreateCart = {
      userId: 'test/id',
      productId: '123456789',
      title: 'good product',
      thumbnail: '',
      url: 'http://good.product.com/good',
      deliveryFee: createDeliveryFee('USD', 0, 1, 0),
      price: { currencyCode: 'USD', amount: 100 },
      quantity: 2,
      country: 'US',
      platformDomainName: 'www.amazon.com',
      isSoldOut: false,
      weight: {
        unit: WeightUnit.LB,
        value: 0,
      },
      dimensions: {
        unit: LengthUnit.IN,
        width: 0,
        height: 0,
        depth: 0,
      },
    };
    await repository.create(item);

    await repository.delete(item.userId, item.productId);

    const actual = await repository.findOne(item.userId, item.productId);
    expect(actual).toBeUndefined();
  });

  it('test findOne', async () => {
    const items = getCartDummies();

    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findOne(
      items[0].userId,
      items[0].productId,
    );

    expect(actual.productId).toBe(items[0].productId);
    expect(actual.title).toBe(items[0].title);
    expect(actual.url).toBe(items[0].url);
  });

  it('test findMany', async () => {
    const items = getCartDummies();

    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findMany(
      items[0].userId,
      items.slice(0, 2).map((i) => i.productId),
    );

    expect(actual.length).toBe(2);
    expect(
      actual.filter((a) => a.productId === items[0].productId).shift(),
    ).toBeTruthy();
    expect(
      actual.filter((a) => a.productId === items[1].productId).shift(),
    ).toBeTruthy();
  });

  it('test query', async () => {
    const items: CreateCart[] = [
      {
        userId: 'test/id',
        productId: '11111111',
        title: 'good product',
        thumbnail: '',
        url: 'http://good.product.com/good',
        price: { currencyCode: 'USD', amount: 100 },
        quantity: 2,
        country: 'US',
        platformDomainName: 'www.amazon.com',
        weight: {
          unit: WeightUnit.LB,
          value: 0,
        },
        dimensions: {
          unit: LengthUnit.IN,
          width: 0,
          height: 0,
          depth: 0,
        },
      },
      {
        userId: 'test/id',
        productId: '22222222',
        title: 'bad product',
        thumbnail: '',
        url: 'http://bad.product.com/bad',
        price: { currencyCode: 'USD', amount: 999 },
        quantity: 1,
        country: 'US',
        platformDomainName: 'www.amazon.com',
        weight: {
          unit: WeightUnit.LB,
          value: 0,
        },
        dimensions: {
          unit: LengthUnit.IN,
          width: 0,
          height: 0,
          depth: 0,
        },
      },
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByUserId(items[0].userId);
    expect(actual.length).toBe(2);
  });
});
