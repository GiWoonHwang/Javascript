import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './common/model/dto/create-user.dto';
import { UserService } from './user.service';

import { UserLoginDto } from './common/model/dto/user-login.dto';
import { VerifyEmailDto } from './common/model/dto/verify-email.dto';
import { UserInfo } from './common/model/interface/UserInfo';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    console.log(dto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    console.log(userId);
    return;
  }
}
