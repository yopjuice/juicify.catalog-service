import { Controller, UsePipes } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto, UpdateArtistPayloadDto } from './dto/update-artist.dto';
import { PingResponse } from '@juice11-micro/contracts';
import { GrpcValidationPipe } from '../../infrastrusture/grpc/grpc.validation-pipe';

@Controller()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @GrpcMethod('CatalogService', 'Ping')
  async ping(): Promise<PingResponse> {
    console.log('Ping');
    return { ok: true }
  }
  @GrpcMethod('ArtistService', 'ListArtists')
  async findAll() {
    const res = await this.artistService.findAll();
    console.log(res);
    return { artists: res }
  }

  @GrpcMethod('ArtistService', 'CreateArtist')
  // @UsePipes(new GrpcValidationPipe())
  async create(@Payload() payload: CreateArtistDto) {
    const res = await this.artistService.create(payload);
    return { artist: res };
  }


  @GrpcMethod('ArtistService', 'GetArtist')
  async findOne(@Payload() payload: { id: string }) {
    const res = await this.artistService.findById(payload.id);
    console.log(res);
    return { artist: res };
  }

  @GrpcMethod('ArtistService', 'UpdateArtist')
  async update(@Payload() payload: UpdateArtistPayloadDto) {
    const {id, ...dto} = payload;
    const res = await this.artistService.update(id, dto);
    console.log(res);
    return { artist: res };
  }

  @GrpcMethod('ArtistService', 'DeleteArtist')
  async delete(@Payload() payload: { id: string }) {
    const res = await this.artistService.delete(payload.id);
    console.log(res);
    return undefined;
  }

}
