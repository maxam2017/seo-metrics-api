import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, readdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup validation pipe
  app.useGlobalPipes(
    new ValidationPipe({ disableErrorMessages: false, whitelist: true }),
  );

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('SEO Metrics API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(process.env);
  await app.listen(3000);
}
bootstrap();

// create `media` folder for putting files
try {
  readdirSync('media');
} catch {
  mkdirSync('media');
}

