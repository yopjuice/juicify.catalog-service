import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepo } from '../../infrastrusture/artist/artist.repo';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepo],
})
export class ArtistModule {}
