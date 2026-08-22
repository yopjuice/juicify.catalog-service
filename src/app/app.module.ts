import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyConfigModule } from '../config/config.module';
import { ArtistModule } from '../modules/artist/artist.module';
// import { ConfigModule } from '@nestjs/config';
// import { grpcEnv } from '../config/env/grpc.env';
// import { databaseEnv } from '../config/env/database.env';
// import { MyConfigService } from '../config/config.service';
// import { TrackModule } from '../modules/track/track.module';
// import { AlbumModule } from '../modules/album/album.module';
import { DatabaseModule } from '../infrastrusture/db/db.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    ArtistModule,
    // TrackModule,
    // AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
