import { createDummyCart } from '@modules/cart/models/cart.fixture';
import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';
import { dummyUserAddress } from '@modules/user-address/models/user-address.fixture';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { CreateOrder } from './models/order.dto';
import { createDummyOrder } from './models/order.fixture';
import { OrderStatus } from './models/order.model';
import { OrderRepository } from './order.repository';

describe.skip('UserAddressRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: OrderRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(OrderRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    const item: CreateOrder = {
      userId: 'testuser1',
      orderId: 'testaddress1',
      carts: [createDummyCart('testuser1', 'product1')],
      address: dummyUserAddress,
      status: OrderStatus.DRAFT,
    };

    await repository.create(item);
  });

  it('test findOne', async () => {
    const item: CreateOrder = createDummyOrder('testuser1', 'testaddress1');

    await repository.create(item);

    const actual = await repository.findOne(item.userId, item.orderId);

    expect(actual.carts[0].productId).toBe(item.carts[0].productId);
    expect(actual.address.addressId).toBe(item.address.addressId);
  });

  it('test findByUserId', async () => {
    const items: CreateOrder[] = [
      createDummyOrder('testuser1', 'testaddress1'),
      createDummyOrder('testuser1', 'testaddress2'),
    ];

    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByUserId(items[0].userId);

    expect(actual.length).toBe(items.length);

    const actual0 = actual
      .filter((i) => i.orderId === items[0].orderId)
      .shift();
    const actual1 = actual
      .filter((i) => i.orderId === items[1].orderId)
      .shift();

    expect(actual0).toBeTruthy();
    expect(actual1).toBeTruthy();
  });

  it('test delete', async () => {
    const item: CreateOrder = createDummyOrder('testuser1', 'testaddress1');

    await repository.create(item);

    await repository.delete(item.userId, item.orderId);

    const actual = await repository.findByUserId(item.userId);
    expect(actual.length).toBe(0);
  });
});
