import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/entity/user.entity';
import { UserController } from './user.controllers';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [EmailModule, AuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
