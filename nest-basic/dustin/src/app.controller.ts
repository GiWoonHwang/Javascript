import {
  Controller,
  Get,
  Inject,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ServiceB } from './prc/service-B';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

/**
 * 와일드카드: 별표를 사용하면 문자열 가운데 어떤 문자가 와도 상관없다.
 * ex) http://localhost:3000/hdustinllo
 */
// @Controller('h*llo')
// @UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly serviceB: ServiceB,
    private readonly configService: ConfigService,
    @Inject('AliasedLoggerService') private readonly serviceAlias: any,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  // @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/request-analysis')
  getHello2(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }

  @Get('redirect/docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get('/serviceB')
  getHelloC(): string {
    return this.serviceB.getHello();
  }

  // @Get('/alias')
  // getHelloTest(): string {
  //   return this.serviceAlias.getHello();
  // }

  @Get('/alias')
  getHello3(): string {
    return this.serviceAlias.getHello();
  }

  @Get('/db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
