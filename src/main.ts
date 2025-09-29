import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // endereço do seu Next.js
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}
bootstrap();
