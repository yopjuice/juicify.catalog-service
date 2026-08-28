import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreRepo } from '../../infrastrusture/genre/genre.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service';
import { grpcClientInterceptor } from '../../infrastrusture/grpc/grpc.client.interceptor';
import { grpcPackages, grpcProtoPaths } from '../../infrastrusture/grpc/gprc.options';
import { GenreGrpc } from '../../infrastrusture/genre/genre.client';

@Module({
  controllers: [GenreController],
  providers: [GenreService, GenreRepo, GenreGrpc],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GENRE_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `localhost:${config.get('grpc.port')}`,
            package: grpcPackages,
            protoPath: grpcProtoPaths,
            channelOptions: {
              interceptors: [grpcClientInterceptor],
            },
          },
        }),
      },
    ]),
  ],
})
export class GenreModule {}
