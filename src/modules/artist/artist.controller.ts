import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PingResponse } from '@juice11/contracts';

@Controller()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @GrpcMethod('CatalogService', 'Ping')
  async ping(): Promise<PingResponse> {
    console.log('Ping');
    return { ok: true }
  }
  @GrpcMethod('ArtistService', 'FindAllArtists')
  findAll() {
    return this.artistService.findAll();
  }

  // @GrpcMethod('ArtistService', 'CreateArtist')
  // create(@Payload() payload: { dto: CreateArtistDto }) {
  //   return this.artistService.create(payload.dto);
  // }
  //
  //
  // @GrpcMethod('ArtistService', 'FindArtist')
  // findOne(@Payload() payload: {id: string}) {
  //   return this.artistService.findById(payload.id);
  // }
  //
  // @GrpcMethod('ArtistService', 'UpdateArtist')
  // update(@Payload() payload: { dto: UpdateArtistDto, id: string }) {
  //   return this.artistService.update(payload.id, payload.dto);
  // }
  //
  // @GrpcMethod('ArtistService', 'DeleteArtist')
  // delete(@Payload() payload: {id: string}) {
  //   return this.artistService.delete(payload.id);
  // }
  //
}
