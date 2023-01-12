import {
  createProvider,
  initConnectionForLocalDynamoDB,
  startExternalDependencies,
} from '@modules/common/repository-test.util';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { CreatePayment } from './models/payments.dto';
import { createPaymentDummy } from './models/payments.fixture';
import { PaymentsRepository } from './payments.repository';

describe.skip('PaymentsRepository', () => {
  let environment: StartedDockerComposeEnvironment;
  let repository: PaymentsRepository;

  beforeEach(async () => {
    environment = await startExternalDependencies();
    initConnectionForLocalDynamoDB();
    repository = await createProvider(PaymentsRepository);
    await repository.createTable();
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test create', async () => {
    const item: CreatePayment = createPaymentDummy('order1');

    await repository.create(item);
  });

  it('test findOne', async () => {
    const item: CreatePayment = createPaymentDummy('order1');

    await repository.create(item);

    const actual = await repository.findOne(item.orderId, item.paymentId);

    expect(actual.userId).toBe(item.userId);
    expect(actual.orderId).toBe(item.orderId);
    expect(actual.payload).toBe(item.payload);
  });

  it('test update', async () => {
    const item = createPaymentDummy('order1');
    await repository.create(item);

    const expectedPgName = 'update pg name';
    item.pgName = expectedPgName;
    const actual = await repository.update(item);

    expect(actual.pgName).toBe(expectedPgName);
  });

  it('test findByOrderId', async () => {
    const items: CreatePayment[] = [
      createPaymentDummy('order1'),
      createPaymentDummy('order1'),
    ];
    const promises = items.map(async (i) => repository.create(i));
    await Promise.all(promises);

    const actual = await repository.findByOrderId(items[0].orderId);
    expect(actual.length).toBe(2);
  });

  it('test delete', async () => {
    const item: CreatePayment = createPaymentDummy('order1');

    await repository.create(item);

    await repository.delete(item.orderId, item.paymentId);

    const actual = await repository.findOne(item.orderId, item.paymentId);
    expect(actual).toBeFalsy();
  });
});
