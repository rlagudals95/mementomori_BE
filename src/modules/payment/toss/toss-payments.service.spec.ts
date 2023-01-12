import { loggerOptions } from '@logging/winston-logger';
import { CartRepository } from '@modules/cart/cart.repository';
import { OrderRepository } from '@modules/order/order.repository';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import { PaymentsRepository } from '../payments.repository';
import { createPaymentId, TossPaymentsService } from './toss-payments.service';
import dynamoose from 'dynamoose';
import { createDummyCart } from '@modules/cart/models/cart.fixture';
import { createDummyOrder } from '@modules/order/models/order.fixture';
import { PaymentConfirmationDto } from './toss-payments.dto';
import { PaymentGateway } from '../models/payments.model';
import { OrderStatus } from '@modules/order/models/order.model';

describe.skip('TossPaymentsService', () => {
  let environment: StartedDockerComposeEnvironment;
  let orderRepository: OrderRepository;
  let cartRepository: CartRepository;
  let paymentsRepository: PaymentsRepository;
  let service: TossPaymentsService;

  beforeEach(async () => {
    const composeFile = '../../../../test/docker-compose.yml';
    environment = await new DockerComposeEnvironment(
      __dirname,
      composeFile,
    ).up();

    process.env.AWS_REGION = 'localhost';
    process.env.AWS_ACCESS_KEY_ID = 'localhost';
    process.env.AWS_SECRET_ACCESS_KEY = 'localhost';
    dynamoose.aws.ddb.local();

    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(loggerOptions())],
      providers: [
        CartRepository,
        OrderRepository,
        PaymentsRepository,
        TossPaymentsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DYNAMODB_TABLE_PREFIX') {
                return 'test-ohzig';
              }
              if (key === 'DYNAMODB_CREATE_DROP_TABLE') {
                return 'true';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    cartRepository = module.get<CartRepository>(CartRepository);
    orderRepository = module.get<OrderRepository>(OrderRepository);
    paymentsRepository = module.get<PaymentsRepository>(PaymentsRepository);
    service = module.get<TossPaymentsService>(TossPaymentsService);

    await Promise.all([
      orderRepository.createTable(),
      cartRepository.createTable(),
      paymentsRepository.createTable(),
    ]);
  });

  afterEach(async () => {
    await environment.down();
  });

  it('test applyToDatabase', async () => {
    const userId = 'test/id';
    const productId = 'product1';
    const orderId = 'order1';
    const pgOrderId = 'uuidv4';
    const paymentId = createPaymentId(PaymentGateway.TOSS_PAYMENTS, pgOrderId);
    await cartRepository.create(createDummyCart(userId, productId));
    await orderRepository.create(createDummyOrder(userId, orderId));

    const paymentConfirmation: PaymentConfirmationDto = {
      customerKey: userId,
      paymentKey: 'paymentKey1',
      orderId,
      pgOrderId,
      amount: 5500,
    };

    await service.applyToDatabase(paymentConfirmation, 'respBody');

    const cart = await cartRepository.findOne(userId, productId);
    expect(cart).toBeFalsy();

    const order = await orderRepository.findOne(userId, orderId);
    expect(order.status).toBe(OrderStatus.PAID);

    const actual = await paymentsRepository.findOne(orderId, paymentId);
    expect(actual).toBeTruthy();
    expect(actual.paymentId).toBe(paymentId);
  }, 30000);

  it('applyToDatabase should rollback when one of operation fails', async () => {
    const userId = 'test/id';
    const productId = 'product1';
    const orderId = 'order1';
    const pgOrderId = 'uuidv4';
    const paymentId = createPaymentId(PaymentGateway.TOSS_PAYMENTS, pgOrderId);
    await cartRepository.create(createDummyCart(userId, productId));
    await orderRepository.create(createDummyOrder(userId, orderId));
    await paymentsRepository.create({
      orderId,
      paymentId,
      pgName: PaymentGateway.TOSS_PAYMENTS,
      pgOrderId,
      userId,
      payload: 'dummy',
    });

    const paymentConfirmation: PaymentConfirmationDto = {
      customerKey: userId,
      paymentKey: 'paymentKey1',
      orderId,
      pgOrderId,
      amount: 5500,
    };

    try {
      await service.applyToDatabase(paymentConfirmation, 'respBody');
    } catch (error) {
      expect(error.message).toBe(
        'Transaction cancelled, please refer cancellation reasons for specific reasons [None, None, ConditionalCheckFailed]',
      );
    }

    const cart = await cartRepository.findOne(userId, productId);
    expect(cart).toBeTruthy();

    const order = await orderRepository.findOne(userId, orderId);
    expect(order.status).toBe(OrderStatus.DRAFT);
  }, 30000);
});
