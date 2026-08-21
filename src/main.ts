import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MyConfigService } from './config/config.service';
import { GrpcValidationPipe } from './infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from './infrastrusture/grpc/grpc.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get<MyConfigService>(MyConfigService);

  const url = configService.get('grpc.host');
  console.log(`Got localhost from env: ${url}`);

  // performs dto validation
  app.useGlobalPipes(new GrpcValidationPipe());
  // Map domain errors to gRPC
  app.useGlobalFilters(new GlobalGrpcExceptionFilter());

  app.startAllMicroservices();
}
bootstrap();
