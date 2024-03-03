import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/entity/user.entity';
import { UserController } from './user.controllers';
import { UserService } from './user.service';
import { Module, Logger } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserHandler } from 'src/command/create-user.handler';
import { VerifyAccessTokenHandler } from 'src/command/verify-access-token.handler';
import { LoginHandler } from 'src/command/login.handler';
import { VerifyEmailHandler } from 'src/command/verify-email.handler';
import { UserEventsHandler } from 'src/event/user-events.handler';
import { GetUserInfoQueryHandler } from 'src/query/get-user-info.handler';
import { CqrsModule } from '@nestjs/cqrs';

const commandHandlers = [
  CreateUserHandler,
  VerifyEmailHandler,
  LoginHandler,
  VerifyAccessTokenHandler,
];

const queryHandlers = [GetUserInfoQueryHandler];

const eventHandlers = [UserEventsHandler];

@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [Logger, ...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class UserModule {}
