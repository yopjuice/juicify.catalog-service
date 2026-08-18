import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from '../../infrastrusture/artist/artist.repo';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService,  ArtistRepository],
})
export class ArtistModule {}
