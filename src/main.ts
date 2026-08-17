import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { createGrpcServer } from './infrastrusture/grpc/grpc.server';
import { MyConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get<MyConfigService>(MyConfigService);

  const url = configService.get('grpc.host');
  console.log(`Got localhost from env: ${url}`);

  // createGrpcServer(app, configService);

  app.startAllMicroservices();
}
bootstrap();
