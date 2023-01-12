import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor() {}

  public async auth(code: string, customerKey: string): Promise<any> {
    try {
      const result = await axios.post(
        'https://api.tosspayments.com/v1/brandpay/authorizations/access-token',
        JSON.stringify({
          grantType: 'AuthorizationCode',
          // Access Token 발급을 위해 리다이렉트 URL에 포함되어 돌아온 code와 customerKey 전달
          code,
          customerKey,
        }),
        {
          headers: {
            // [TODO] Basic 인증 방식의 사용자명과 비밀번호는 콜론으로 구분해서 `사용자명:비밀번호`로 추가합니다. 상점의 시크릿 키를 사용자명으로, 비밀번호는 공백으로 추가한 뒤 base64로 인코딩하세요.
            Authorization: `Basic ${Buffer.from(
              'test_sk_k6bJXmgo28e9y7wMA5M8LAnGKWx4' + ':',
              'utf8',
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return { status: 200 };
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
