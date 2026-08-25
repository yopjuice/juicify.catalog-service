import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistPayloadDto } from './dto/update-artist.dto';
import type { PingResponse } from '@juice11-micro/contracts';
import { DeleteArtistDto } from './dto/delete-artist.dto';
import { GetArtistDto } from './dto/get-artist.dto';
import { Logger } from '@nestjs/common';

@Controller()
export class ArtistController {
  private readonly logger = new Logger(ArtistController.name);

  constructor(private readonly artistService: ArtistService) {}

  // Simple ping handler for testing
  // TODO:move this elsewhere or remove
  @GrpcMethod('CatalogService', 'Ping')
  ping(): PingResponse {
    this.logger.log('Ping');
    return { ok: true };
  }
  @GrpcMethod('ArtistService', 'ListArtists')
  async findAll() {
    const res = await this.artistService.findAll();
    this.logger.log(res);

    return { artists: res };
  }

  @GrpcMethod('ArtistService', 'CreateArtist')
  async create(@Payload() payload: CreateArtistDto) {
    const res = await this.artistService.create(payload);
    return { artist: res };
  }

  @GrpcMethod('ArtistService', 'GetArtist')
  async findOne(@Payload() payload: GetArtistDto) {
    const res = await this.artistService.findById(payload.id);
    this.logger.log(res);
    return { artist: res };
  }

  @GrpcMethod('ArtistService', 'UpdateArtist')
  async update(@Payload() payload: UpdateArtistPayloadDto) {
    const { id, ...dto } = payload;
    const res = await this.artistService.update(id, dto);
    this.logger.log(res);
    return { artist: res };
  }

  @GrpcMethod('ArtistService', 'DeleteArtist')
  async delete(@Payload() payload: DeleteArtistDto) {
    const res = await this.artistService.delete(payload.id);
    this.logger.log(res);
    return undefined;
  }
}
