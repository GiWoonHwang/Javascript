import { UserController } from './user.controllers';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
