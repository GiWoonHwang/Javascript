import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Headers,
  Inject,
  LoggerService,
  InternalServerErrorException,
  Logger,
  UseFilters,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './model/dto/create-user.dto';
import { UserService } from './user.service';
import { Logger as WinstonLogger } from 'winston';
import { UserLoginDto } from './model/dto/user-login.dto';
import { VerifyEmailDto } from './model/dto/verify-email.dto';
import { UserInfo } from './model/interface/UserInfo';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { HttpExceptionFilter } from './exception/http-exception.filter';

@Controller('user')
export class UserController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto);

    const { name, email, password } = dto;

    await this.usersService.createUser(name, email, password);
  }

  // private printWinstonLog(dto) {
  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  private printLoggerServiceLog(dto) {
    // stack로 출력함
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }

  // @UseFilters(HttpExceptionFilter)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   if (+id < 1) {
  //     // 1. 단순 문자열
  //     // throw new BadRequestException('id는 0보다 큰 정수여야 합니다');

  //     // 2. HttpException
  //     throw new HttpException(
  //       {
  //         errorMessage: 'id는 0보다 큰 정수여야 합니다',
  //         foo: 'bar',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );

  //     // 3. 기본 제공 예외에 description을 함께 전달
  //     throw new BadRequestException(
  //       'id는 0보다 큰 정수여야 합니다',
  //       'id format exception',
  //     );
  //   }
  // }
}
