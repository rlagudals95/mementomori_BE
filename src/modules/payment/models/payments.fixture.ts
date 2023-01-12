import generateNoDashUUID from '@utils/uuid.util';
import { CreatePayment } from './payments.dto';

export function createPaymentDummy(orderId: string): CreatePayment {
  const pgOrderId = generateNoDashUUID(10);
  return {
    orderId,
    paymentId: 'tosspayments_' + pgOrderId,
    pgName: 'tosspayments',
    pgOrderId,
    userId: 'testuser1',
    payload: JSON.stringify({
      mId: 'vivarepublica',
      paymentKey: 'aZDBYqJLQ1GKNbdOvk5rky6nA7yqA3n07xlzmj6R9e4oPpEX',
      orderId: '2Gp7VoNLozmIiI5VgHeht',
      orderName: '토스 티셔츠 외 2건',
      status: 'DONE',
      requestedAt: '2022-12-26T21:59:39+09:00',
      approvedAt: '2022-12-26T21:59:39+09:00',
      card: {
        issuerCode: '51',
        acquirerCode: '51',
      },
    }),
  };
}
