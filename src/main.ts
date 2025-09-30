import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🚨 Liberar tudo (apenas para teste, não é recomendado em produção)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false, // se usar cookies, precisa ser true (e aí não pode usar '*')
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}
bootstrap();



