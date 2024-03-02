import { Module } from '@nestjs/common';
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
export class AppModule {}
