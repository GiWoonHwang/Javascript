import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { BaseService } from './user/base-service';
import { ServiceA } from './user/service-A';
import { ServiceB } from './user/service-B';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LoggerService } from './prc/provider/logger.service';
import emailConfig from 'src/config/emailConfig';
import { validationSchema } from 'src/config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { UserController } from './user/user.controllers';

const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // 'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, // 'root',
      password: process.env.DATABASE_PASSWORD, // 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'User',
      synchronize: true,
      migrationsRun: false,
    }),
  ],
  controllers: [ApiController, AppController],
  providers: [
    AppService,
    BaseService,
    ServiceA,
    ServiceB,
    LoggerService,
    loggerAliasProvider,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      // forRoutes에 해당되는 곳에서만 사용
      .apply(LoggerMiddleware, Logger2Middleware)
      // .forRoutes('/users')
      // 미들웨어에서 제외할 경로 설정
      .exclude({ path: 'user', method: RequestMethod.GET })
      .forRoutes(UserController);
  }
}
