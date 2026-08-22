import { NestFactory } from '@nestjs/core';
import { MyConfigService } from './config/config.service';
import { GrpcValidationPipe } from './infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from './infrastrusture/grpc/grpc.filter';
import { createGrpcServer } from './infrastrusture/grpc/grpc.server';
import { MyConfigModule } from './config/config.module';

async function bootstrap() {
  // Resolves MyConfigModule ONLY
  const configContext =
    await NestFactory.createApplicationContext(MyConfigModule);
  const configService = configContext.get(MyConfigService);

  // Inits app as grpc microservice
  const app = await createGrpcServer(configService);
  // performs dto validation
  app.useGlobalPipes(new GrpcValidationPipe());
  // Map domain errors to gRPC
  app.useGlobalFilters(new GlobalGrpcExceptionFilter());

  await configContext.close();

  await app.listen();
}
bootstrap();
