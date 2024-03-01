import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { BaseService } from './user/base-service';
import { ServiceA } from './user/service-A';
import { ServiceB } from './user/service-B';

@Module({
  imports: [UserModule],
  controllers: [ApiController, AppController],
  providers: [AppService, BaseService, ServiceA, ServiceB],
})
export class AppModule {}
