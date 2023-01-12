import { CartRepository } from '@modules/cart/cart.repository';
import { OrderStatus } from '@modules/order/models/order.model';
import { OrderRepository } from '@modules/order/order.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import dynamoose from 'dynamoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { PaymentGateway } from '../models/payments.model';
import { PaymentsRepository } from '../payments.repository';
import { PaymentConfirmationDto } from './toss-payments.dto';

@Injectable()
export class TossPaymentsService {
  readonly secretKey: string;
  readonly baseUrl: string = 'https://api.tosspayments.com/v1/brandpay';
  readonly authHeader: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly paymentsRepository: PaymentsRepository,
  ) {
    this.secretKey = configService.get('TOSS_PAYMENTS_SECRET_KEY');
    const secretKeyInBase64 = Buffer.from(
      this.secretKey + ':',
      'utf8',
    ).toString('base64');
    this.authHeader = `Basic ${secretKeyInBase64}`;
  }

  async processAuthCallback(code: string, customerKey: string) {
    try {
      await axios.post(
        `${this.baseUrl}/authorizations/access-token`,
        JSON.stringify({ grantType: 'AuthorizationCode', code, customerKey }),
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      this.logger.error(
        'tosspayments authCallback failed',
        error.response.data,
      );
      throw error;
    }
  }

  async confirm(paymentConfirmation: PaymentConfirmationDto) {
    try {
      const { pgOrderId, ...rest } = paymentConfirmation;
      const resp = await axios.post(
        `${this.baseUrl}/payments/confirm`,
        { ...rest, orderId: pgOrderId },
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.info(JSON.stringify(resp.data));

      // TODO: paymentConfirmation validation

      await this.applyToDatabase(
        paymentConfirmation,
        JSON.stringify(resp.data),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error('tosspayments confirm failed', error.response.data);
      }
      throw error;
    }
  }

  async applyToDatabase(
    paymentConfirmation: PaymentConfirmationDto,
    responseBody: string,
  ) {
    const { customerKey: userId, orderId, pgOrderId } = paymentConfirmation;
    const paymentId = createPaymentId(PaymentGateway.TOSS_PAYMENTS, pgOrderId);

    const order = await this.orderRepository.findOne(userId, orderId);
    const deleteCartsTransactions = order.carts
      .map((c) => c.productId)
      .map((productId) =>
        this.cartRepository.transaction.delete({ userId, productId }),
      );

    const addPaymentTransaction = this.paymentsRepository.transaction.create({
      orderId,
      paymentId,
      pgName: PaymentGateway.TOSS_PAYMENTS,
      pgOrderId,
      userId,
      payload: responseBody,
    });

    await dynamoose.transaction([
      this.orderRepository.transaction.update(
        { userId, orderId },
        { status: OrderStatus.PAID },
      ),
      ...deleteCartsTransactions,
      addPaymentTransaction,
    ]);
  }
}

export function createPaymentId(pg: PaymentGateway, pgOrderId: string): string {
  return pg + '_' + pgOrderId;
}
