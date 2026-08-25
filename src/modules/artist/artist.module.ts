import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepo } from '../../infrastrusture/artist/artist.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service';
import { grpcClientInterceptor } from '../../infrastrusture/grpc/grpc.client.interceptor';
import { grpcPackages, grpcProtoPaths } from '../../infrastrusture/grpc/gprc.options';
import { ArtistGrpc } from '../../infrastrusture/artist/artist.client';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepo, ArtistGrpc],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ARTIST_INTERNAL_PROXY',
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
export class ArtistModule {}
