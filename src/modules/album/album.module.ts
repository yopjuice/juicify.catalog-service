import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepo } from '../../infrastrusture/album/album.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service';
import { grpcClientInterceptor } from '../../infrastrusture/grpc/grpc.client.interceptor';
import { grpcPackages, grpcProtoPaths } from '../../infrastrusture/grpc/gprc.options';
import { AlbumGrpc } from '../../infrastrusture/album/album.client';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepo, AlbumGrpc],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ALBUM_INTERNAL_PROXY',
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
export class AlbumModule {}
