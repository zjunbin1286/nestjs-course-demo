import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, // 支持跨域
  });
  // 开启静态资源访问
  app.useStaticAssets(join(__dirname, '..', 'my-uploads'), {
    prefix: '/upload',
  });
  await app.listen(3000);
}
bootstrap();
