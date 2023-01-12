import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthTempTokenRepository {
  private redis: Redis;
  private readonly timeout: number = 60;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: configService.get('REDIS_URL'),
      port: configService.get('REDIS_PORT'),
      keyPrefix: 'temptoken:',
    });
  }

  async set(token: string, value: string): Promise<string> {
    return this.redis.set(token, value, 'EX', this.timeout);
  }

  async get(token: string): Promise<string> {
    return this.redis.get(token);
  }
}
