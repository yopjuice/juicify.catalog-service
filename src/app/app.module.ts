import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyConfigModule } from '../config/config.module';
import { ArtistModule } from '../modules/artist/artist.module';
import { TrackModule } from '../modules/track/track.module';
import { AlbumModule } from '../modules/album/album.module';
import { DatabaseModule } from '../infrastrusture/db/db.module';
import { GenreModule } from '../modules/genre/genre.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    ArtistModule,
    GenreModule,
    TrackModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
