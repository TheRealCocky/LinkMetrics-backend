import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}
bootstrap();


