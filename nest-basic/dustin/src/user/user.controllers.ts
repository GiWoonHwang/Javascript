import {
  Controller,
  Inject,
  LoggerService,
  Post,
  Body,
  Query,
  UseGuards,
  Get,
  Param,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserCommand } from 'src/command/create-user.command';
import { LoginCommand } from 'src/command/login.command';
import { VerifyEmailCommand } from 'src/command/verify-email.command';
import { GetUserInfoQuery } from 'src/query/get-user-info.query';

import { CreateUserDto } from './model/dto/create-user.dto';
import { UserLoginDto } from './model/dto/user-login.dto';
import { VerifyEmailDto } from './model/dto/verify-email.dto';
import { UserInfo } from './model/interface/UserInfo';

@Controller('user')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;

    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    const command = new LoginCommand(email, password);

    return this.commandBus.execute(command);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }
}
