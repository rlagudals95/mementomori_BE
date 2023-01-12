import { Controller, Get } from '@nestjs/common';
import { Public } from '@modules/auth/jwt-auth.guard';

@Public()
@Controller('/health')
export class HealthController {
  @Get()
  getHealth() {
    // TODO: apply Terminus
    // ref0: https://docs.nestjs.com/recipes/terminus
    // ref1: https://wikidocs.net/158664
    // ref2: https://progressivecoder.com/nestjs-health-check-terminus/
    // ref3: https://betterjavacode.com/programming/adding-health-checks-in-nestjs-application
    // ref4: https://wanago.io/2021/10/11/api-nestjs-health-checks-terminus-datadog/
    return { status: 'up' };
  }
}
