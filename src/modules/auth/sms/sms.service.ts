import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import crypto from 'crypto';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SmsService {
  readonly ncpAccessKey: string;
  readonly ncpSecretKey: string;
  readonly smsFrom: string;
  readonly serviceId: string;
  readonly baseUrl: string = 'https://sens.apigw.ntruss.com';
  readonly path: string;
  readonly url: string;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {
    this.ncpAccessKey = configService.get('NCP_ACCESS_KEY');
    this.ncpSecretKey = configService.get('NCP_SECRET_KEY');
    this.smsFrom = configService.get('NCP_SMS_FROM');
    this.serviceId = configService.get('NCP_SMS_SERVICE_ID');
    this.path = `/sms/v2/services/${this.serviceId}/messages`;
    this.url = this.baseUrl + this.path;
  }

  // https://api.ncloud-docs.com/docs/ai-application-service-sens-smsv2
  // https://api.ncloud-docs.com/docs/common-ncpapi
  public async sendSms(phone: string, message: string) {
    try {
      const body = {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: this.smsFrom,
        content: message,
        messages: [
          {
            to: phone,
          },
        ],
      };
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-apigw-timestamp': Date.now().toString(),
          'x-ncp-iam-access-key': this.ncpAccessKey,
          'x-ncp-apigw-signature-v2': this.makeSignature(),
        },
      };

      const result = await axios.post(this.url, body, options);
      const response = await result.data;
      this.logger.info(`sendSms response :: ${JSON.stringify(response)}`);
    } catch (error) {
      this.logger.error(`sendSms(${phone}) failed`, error);
      throw error;
    }
  }

  public makeRandomNumber(digit: number): string {
    const randNum = Math.floor(Math.random() * 10 ** digit);
    return randNum.toString().padStart(digit, '0');
  }

  private makeSignature(): string {
    const hmac = crypto.createHmac('sha256', this.ncpSecretKey);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const message = [
      method,
      space,
      this.path,
      newLine,
      Date.now().toString(),
      newLine,
      this.ncpAccessKey,
    ];
    const signature = hmac.update(message.join('')).digest('base64');
    return signature.toString();
  }
}
