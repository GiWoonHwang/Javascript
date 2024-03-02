import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// dotenv 패키지를 직접 사용하는 경우
// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'production') ? '.production.env'
//       : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
