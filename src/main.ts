import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000', // frontend em dev
        'https://link-metrics-frontend.vercel.app', // frontend em produção
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // libera
      } else {
        callback(new Error('Not allowed by CORS')); // bloqueia
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}
bootstrap();





