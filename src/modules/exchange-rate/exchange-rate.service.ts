import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { toFloat, toYyyyMmDd } from '@utils/cast.util';
import retryIf from '@utils/retry-axios';
import {
  CurrencyCode,
  ExchangeRateDto,
  KoreaEximExchangeRate,
} from './models/exchange-rate.dto';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Cron } from '@nestjs/schedule';
import { ExchangeRateRepository } from './exchange-rate.repository';
import {
  DataSource,
  exchangeRateUpdate,
} from './models/exchange-rate.constant';

@Injectable()
export class ExchangeRateService {
  private exchangeRates: ExchangeRateDto[] = [];
  private nextUpdate: Date;

  constructor(
    private configService: ConfigService,
    private exchangeRepository: ExchangeRateRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  public getNextUpdateDate(): Date {
    return this.nextUpdate;
  }

  public async findAll(
    currencyCodesQuery: CurrencyCode,
  ): Promise<ExchangeRateDto[]> {
    try {
      const currencyCodes = currencyCodesQuery.currencyCode;

      if (!this.exchangeRates.length) {
        await this.updateFromKoreaExim();
      }
      if (!this.exchangeRates.length) {
        this.exchangeRates = await this.findLatestFromDB();
      }
      return this.exchangeRates.filter((r) =>
        currencyCodes ? currencyCodes.includes(r.currencyCode) : true,
      );
    } catch (error) {
      throw error;
    }
  }

  private async findLatestFromDB(): Promise<ExchangeRateDto[]> {
    const latest = await this.exchangeRepository.findLatestByDataSource(
      DataSource.KOREAEXIM,
    );
    this.updateNextUpdateTime();
    return latest.shift().exchangeRate;
  }

  @Cron(`0 ${exchangeRateUpdate.minute} ${exchangeRateUpdate.hour} * * *`)
  private async updateExchangeRates() {
    this.logger.info('start updateExchangeRates');
    await this.updateFromKoreaExim();
    this.logger.info('ends updateExchangeRates');
  }

  /** 한국수출입은행 */
  public async updateFromKoreaExim() {
    // REF: https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C#tab1
    const apiKey = this.configService.get('KOREA_EXIM_AUTH_KEY');
    const searchDate = this.getLatestPossibleDate();
    const param = `authkey=${apiKey}&searchdate=${searchDate}&data=AP01`;
    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?${param}`;
    const result: KoreaEximExchangeRate[] = await retryIf('GET', url);

    if (!this.validateKoreaEximResponse(result)) {
      return;
    }

    const currencyCodeMap = new Map([
      ['CNH', { to: 'CNY', weight: 1, symbol: '¥' }],
      ['JPY(100)', { to: 'JPY', weight: 0.01, symbol: '¥' }],
      ['USD', { to: 'USD', weight: 1, symbol: '$' }],
    ]);

    this.exchangeRates = result
      .filter((r) => currencyCodeMap.has(r.cur_unit))
      .map((r) => {
        const mapped = currencyCodeMap.get(r.cur_unit);
        return {
          currencyCode: mapped.to,
          exchangeRate: mapped.weight * toFloat(r.tts),
          symbol: mapped.symbol,
        };
      });

    try {
      await this.exchangeRepository.create({
        yyyymmdd: searchDate,
        dataSource: DataSource.KOREAEXIM,
        exchangeRate: this.exchangeRates,
      });
    } catch (error) {
      this.logger.info('Failed to save fetched exchange rate.');
    }

    this.updateNextUpdateTime();
  }

  private updateNextUpdateTime() {
    const updated = new Date();
    if (updated.getHours() > exchangeRateUpdate.hour) {
      updated.setDate(updated.getDate() + 1);
    }
    updated.setHours(exchangeRateUpdate.hour, exchangeRateUpdate.minute, 0, 0);
    this.nextUpdate = updated;
  }

  private validateKoreaEximResponse(result: KoreaEximExchangeRate[]): boolean {
    if (result.length === 0) {
      this.logger.error('Empty result from KoreaExim');
      return false;
    }
    const abnormals = result.filter((r) => r.result != 1);
    if (result.length !== 0 && abnormals.length === 0) {
      return true;
    }
    this.logger.error(
      'Found errors when validating exchange rate result from KoreaExim',
      abnormals,
    );
    return false;
  }

  private getLatestPossibleDate(): string {
    const now = new Date();
    if (
      now.getHours() < exchangeRateUpdate.hour ||
      (now.getHours() == exchangeRateUpdate.hour &&
        now.getMinutes() < exchangeRateUpdate.minute)
    ) {
      now.setDate(now.getDate() - 1);
    }
    return toYyyyMmDd(now.getTime());
  }

  // https://unipass.customs.go.kr:38010/ext/rest/trifFxrtInfoQry/retrieveTrifFxrtInfo?crkyCn=i230g262x161e176x000o000i5&qryYymmDd=20221108&imexTp=2
  // public async updateFromUnipass() {
  // }

  // public async updateFromHanaBank() {}
}
