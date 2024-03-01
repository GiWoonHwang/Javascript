import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';

@Module({
  imports: [UserModule],
  controllers: [ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
