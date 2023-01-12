import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { configOptions } from './config/configuration';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { loggerOptions } from './logging/winston-logger';
import { ApiLoggerMiddleware } from './middlewares/api-logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { HealthModule } from './modules/health/health.module';
import { HomeModule } from './modules/home/home.module';
import { SearchModule } from './modules/search/search.module';
import { TempUserModule } from './modules/temp-user/temp-user.module';
import { TranslationModule } from './modules/translation/translation.module';
import { UserModule } from './modules/user/user.module';
import { CartModule } from './modules/cart/cart.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CustomsModule } from './modules/customs/customs.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ScrapModule } from './modules/scrap/scrap.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { I18nModule } from 'nestjs-i18n';
import { i18nOptions } from '@i18n/i18n.option';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions()),
    WinstonModule.forRoot(loggerOptions()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
    I18nModule.forRoot(i18nOptions()),
    ScheduleModule.forRoot(),
    HealthModule,
    HomeModule,
    SearchModule,
    TranslationModule,
    UserModule,
    TempUserModule,
    AuthModule,
    ExchangeRateModule,
    CartModule,
    DeliveryModule,
    PaymentModule,
    CustomsModule,
    UserAddressModule,
    OrderModule,
    PaymentModule,
    ScrapModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiLoggerMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
