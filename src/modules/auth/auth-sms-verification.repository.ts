import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthSmsVerificationRepository {
  private redis: Redis;

  // 클라이언트 입장에서 인증번호 보내기 버튼 누른 후 전송 처리되는데까지
  // 소요되는 시간(대략 1초)을 추가로 더해줌
  private readonly timeout: number = 51;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: configService.get('REDIS_URL'),
      port: configService.get('REDIS_PORT'),
      keyPrefix: 'smsverification:',
    });
  }

  async set(userId: string, value: string): Promise<string> {
    return this.redis.set(userId, value, 'EX', this.timeout);
  }

  async get(userId: string): Promise<string> {
    return this.redis.get(userId);
  }
}
