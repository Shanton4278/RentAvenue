import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appEnv = process.env.APP_ENV;

  if (appEnv === 'development' || appEnv === 'local') {
    const config = new DocumentBuilder()
      .setTitle('Ghana Rent Hub API')
      .setDescription('API for renting, buying, and leasing properties')
      .setVersion('1.0')
      .addServer(`http://localhost:${process.env.PORT || 3001}`)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = appEnv === 'local' ? 'ghana-rent-hub/dev/documentation' : '/dev/documentation';
    SwaggerModule.setup(swaggerPath, app, document);
  }

  // Enable CORS for all origins
  app.enableCors({ origin: /.+/ });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Set payload limits for incoming JSON and URL-encoded data
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Start the application
  await app.listen(process.env.PORT || 3001);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
});
