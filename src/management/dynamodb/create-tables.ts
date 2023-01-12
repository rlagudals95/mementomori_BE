import { configOptions } from '@config/configuration';
import { loggerOptions } from '@logging/winston-logger';
import { CartRepository } from '@modules/cart/cart.repository';
import { ICreateTable } from '@modules/common/interface/create-table.interface';
import { ExchangeRateRepository } from '@modules/exchange-rate/exchange-rate.repository';
import { OrderRepository } from '@modules/order/order.repository';
import { PaymentsRepository } from '@modules/payment/payments.repository';
import { ScrapRepository } from '@modules/scrap/scrap.repository';
import { KeywordDictionaryRepository } from '@modules/search/keyword-dictionary.repository';
import { TempUserRepository } from '@modules/temp-user/temp-user.repository';
import { UserAddressRepository } from '@modules/user-address/user-address.repository';
import { UserRepository } from '@modules/user/user.repository';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { loadCredential } from '@utils/aws.util';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions()),
    WinstonModule.forRoot(loggerOptions()),
  ],
  providers: [
    KeywordDictionaryRepository,
    UserRepository,
    TempUserRepository,
    CartRepository,
    ExchangeRateRepository,
    UserAddressRepository,
    OrderRepository,
    PaymentsRepository,
    ScrapRepository,
  ],
})
export class TempModule {}

async function bootstrap() {
  await loadCredential();
  const app = await NestFactory.createApplicationContext(TempModule);
  const promises = [
    app.get<ICreateTable>(KeywordDictionaryRepository),
    app.get<ICreateTable>(UserRepository),
    app.get<ICreateTable>(TempUserRepository),
    app.get<ICreateTable>(CartRepository),
    app.get<ICreateTable>(ExchangeRateRepository),
    app.get<ICreateTable>(UserAddressRepository),
    app.get<ICreateTable>(OrderRepository),
    app.get<ICreateTable>(PaymentsRepository),
    app.get<ICreateTable>(ScrapRepository),
  ].map(async (repo) => repo.createTable());
  await Promise.all(promises);
}
bootstrap();
