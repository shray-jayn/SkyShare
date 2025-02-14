import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { BigIntInterceptor } from './bigint.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['https://skyshare.shray.tech','https://sky-share-frontend.vercel.app', 'http://localhost:5173', 'https://d3owmfg6w5deom.cloudfront.net/'];

  app.enableCors({
    origin: function (origin, callback) {
      console.log(`CORS request from origin: ${origin}`);
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new BigIntInterceptor());

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
