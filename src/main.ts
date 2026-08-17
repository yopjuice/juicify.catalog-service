import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { createGrpcServer } from './infrastrusture/grpc/grpc.server';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // const configService = app.get<ConfigService>(ConfigService);

  // createGrpcServer(app, configService);

  app.startAllMicroservices();
}
bootstrap();
