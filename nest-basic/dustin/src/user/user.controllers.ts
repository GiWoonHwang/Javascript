import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from './model/dto/create-user.dto';
import { UserService } from './user.service';

import { UserLoginDto } from './model/dto/user-login.dto';
import { VerifyEmailDto } from './model/dto/verify-email.dto';
import { UserInfo } from './model/interface/UserInfo';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    console.log('type', typeof dto.name);
    const { name, email, password } = dto;

    await this.usersService.createUser(name, email, password);
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
}
