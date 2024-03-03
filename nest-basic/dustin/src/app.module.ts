import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { BaseService } from './prc/base-service';
import { ServiceA } from './prc/service-A';
import { ServiceB } from './prc/service-B';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LoggerService } from './prc/provider/logger.service';
import emailConfig from 'src/config/emailConfig';
import { validationSchema } from 'src/config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Logger2Middleware } from './middleware/logger2.middleware';
import { UserController } from './user/user.controllers';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import authConfig from './config/authConfig';
import { LoggerModule } from './logging/logger.module';
// import winston from 'winston';  이렇게 임포트하면 안됨
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { ExceptionModule } from './user/exception/exception.module';
import { LoggingModule } from './interceptor/logging.module';
import { BatchModule } from './batch/batch.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckController } from './health-check/health-check.controller';
import { DogHealthIndicator } from './health-check/dog.health';

const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    UserModule,
    LoggerModule,
    ExceptionModule,
    LoggingModule,
    BatchModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
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
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         nestWinstonModuleUtilities.format.nestLike('MyApp', {
    //           prettyPrint: true,
    //         }),
    //       ),
    //     }),
    //   ],
    // }),
  ],
  controllers: [ApiController, AppController, HealthCheckController],
  providers: [
    AppService,
    BaseService,
    ServiceA,
    ServiceB,
    LoggerService,
    loggerAliasProvider,
    DogHealthIndicator,
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
