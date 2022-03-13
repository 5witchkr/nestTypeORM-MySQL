import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const port = process.env.NODE_SERVER_PORT;
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('NODE_SERVER_PORT');
  app.use(cookieParser());
  await app.listen(port);
  console.log(`application listening on port ${port}`);
}
bootstrap();
