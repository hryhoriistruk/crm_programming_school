import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/http/global-exception.filter';
import { createValidationExceptionFactory } from './common/validation/validation-exception.factory';
import { AppConfig } from './configs/configs.type';
import { LoggerService } from './modules/logger/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter(new LoggerService()));

  const config = new DocumentBuilder()
    .setTitle('CRM programming school')
    .setDescription(
      'The API documentation for the CRM Programming School system. This CRM system is designed to manage and streamline the operations of a programming school, ensuring efficient handling of student information, course management, and administrative tasks.',
    )
    .setVersion('0.1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup(appConfig.swagger_url_path, app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: createValidationExceptionFactory(),
    }),
  );
  await app.listen(appConfig.port, appConfig.host, () => {
    console.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    console.log(
      `Swagger running on http://localhost:${appConfig.port}/${appConfig.swagger_url_path}`,
    );
  });
}
void bootstrap();
