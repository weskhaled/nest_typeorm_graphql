import { graphqlUploadExpress } from 'graphql-upload';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './modules/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './modules/interceptors/timeout.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  );

  app.enableCors();

  const configService = app.select(AppModule).get(ConfigService);

  // Swagger configuration
  const documentBuilder = new DocumentBuilder()
    .setTitle('OpenAI Microservice Template')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('/', app, document);

  await app.listen(configService.get('PORT') || 8000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
