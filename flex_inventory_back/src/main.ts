import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   const configService = app.get(ConfigService);
  // Enable CORS for all origins (development only)
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  // Enable CORS
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'http://localhost:3001',
  //     'http://localhost:5173', // Vite
  //     'http://localhost:4200', // Angular
  //     'http://localhost:8080', // Vue
  //     'https://yourdomain.com', // Your production domain
  //   ],
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'Authorization',
  //     'X-Requested-With',
  //     'Accept',
  //     'Origin',
  //     'Access-Control-Allow-Headers',
  //     'Access-Control-Request-Method',
  //     'Access-Control-Request-Headers',
  //   ],
  //   credentials: true,
  // });


  //   const isDevelopment = process.env.NODE_ENV === 'development';
  
  // app.enableCors({
  //   origin: isDevelopment
  //     ? [
  //         'http://localhost:3000',
  //         'http://localhost:3001',
  //         'http://localhost:5173',
  //         'http://localhost:4200',
  //         'http://localhost:8080',
  //       ]
  //     : [
  //         'https://yourproductiondomain.com',
  //         'https://www.yourproductiondomain.com',
  //       ],
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'Authorization',
  //     'X-Requested-With',
  //     'Accept',
  //     'Origin',
  //   ],
  //   credentials: true,
  // });
  

  const allowedOrigins = configService.get('ALLOWED_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4200',
  ];
  
  // app.enableCors({
  //   origin: allowedOrigins,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'Authorization',
  //     'X-Requested-With',
  //     'Accept',
  //     'Origin',
  //   ],
  //   credentials: true,
  // });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(4500);
}
bootstrap();
