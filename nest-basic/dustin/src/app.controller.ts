import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * 와일드카드: 별표를 사용하면 문자열 가운데 어떤 문자가 와도 상관없다.
 * ex) http://localhost:3000/hdustinllo
 */
// @Controller('h*llo')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
