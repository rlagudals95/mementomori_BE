import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { Parser } from 'xml2js';
import { GeneralResultDto } from '@modules/common/models/common.dto';
import { ValidatePCCCDto, ValidatePCCCResult } from './customs.dto';

@Injectable()
export class CustomsService {
  readonly baseUrl: string = 'https://unipass.customs.go.kr:38010/ext/rest/';
  readonly xmlParser = new Parser({
    explicitRoot: false,
    explicitArray: false,
  });

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  async validatePCCC(
    validatePCCCDto: ValidatePCCCDto,
  ): Promise<GeneralResultDto> {
    const validateUrl = this.baseUrl + 'persEcmQry/retrievePersEcm';
    const param = new URLSearchParams({
      crkyCn: this.configService.get('UNIPASS_PERS_ECM'),
      persEcm: validatePCCCDto.pccc,
      pltxNm: validatePCCCDto.name,
      cralTelno: validatePCCCDto.phone,
    });

    try {
      const url = `${validateUrl}?${param.toString()}`;
      this.logger.info(url);
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/xml',
        },
      });
      this.logger.info(JSON.stringify(response.data));

      const result = (await this.xmlParser.parseStringPromise(
        response.data,
      )) as ValidatePCCCResult;

      if (result.tCnt !== '1') {
        this.logger.info(result.persEcmQryRtnErrInfoVo.errMsgCn);
      }

      return {
        success: result.tCnt === '1',
        errorMessage: parseErrorMessage(result),
      };
    } catch (error) {
      throw error;
    }
  }
}

function parseErrorMessage(result: ValidatePCCCResult): string | undefined {
  if (result.tCnt === '1') {
    return undefined;
  }
  // FROM: 입력하신 납세의무자명(김시)이 개인통관고유부호의 성명과 일치하지 않습니다. 납세의무자명(pltxNm) 파라미터가 깨질경우 UTF-8로 변환하여 실행하십시오.
  // TO: 입력하신 납세의무자명(김시)이 개인통관고유부호의 성명과 일치하지 않습니다
  return result?.persEcmQryRtnErrInfoVo?.errMsgCn.split('.').shift();
}
