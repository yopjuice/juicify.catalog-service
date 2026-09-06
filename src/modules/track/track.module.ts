import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepo } from '../../infrastrusture/track/track.repo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service';
import { grpcClientInterceptor } from '../../infrastrusture/grpc/grpc.client.interceptor';
import { grpcPackages, grpcProtoPaths } from '../../infrastrusture/grpc/gprc.options';
import { TrackGrpc } from '../../infrastrusture/track/track.client';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepo, TrackGrpc],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRACK_INTERNAL_PROXY',
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
export class TrackModule {}
