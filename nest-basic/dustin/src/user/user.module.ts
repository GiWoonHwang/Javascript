import { UserController } from './user.controllers';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
