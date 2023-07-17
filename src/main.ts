// src/main.ts

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
//import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { AllExceptionsFilter } from './exceptions/allexception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, {
    logger:
      configService.get('DEBUG') === 'development'
        ? ['error', 'warn', 'log', 'debug']
        : ['error', 'warn', 'log'],
  });
  const logger = new Logger('bootstrap');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
