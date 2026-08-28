import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumPayloadDto } from './dto/update-album.dto';
import type { PingResponse } from '@juice11-micro/contracts';
import { DeleteAlbumDto } from './dto/delete-album.dto';
import { GetAlbumDto } from './dto/get-album.dto';
import { Logger } from '@nestjs/common';

@Controller()
export class AlbumController {
  private readonly logger = new Logger(AlbumController.name);

  constructor(private readonly albumService: AlbumService) {}

  // Simple ping handler for testing
  // TODO:move this elsewhere or remove
  @GrpcMethod('CatalogService', 'Ping')
  ping(): PingResponse {
    this.logger.log('Ping');
    return { ok: true };
  }
  @GrpcMethod('AlbumService', 'ListAlbums')
  async findAll() {
    const res = await this.albumService.findAll();
    this.logger.log(res);

    return { albums: res };
  }

  @GrpcMethod('AlbumService', 'CreateAlbum')
  async create(@Payload() payload: CreateAlbumDto) {
    const res = await this.albumService.create(payload);
    return { album: res };
  }

  @GrpcMethod('AlbumService', 'GetAlbum')
  async findOne(@Payload() payload: GetAlbumDto) {
    const res = await this.albumService.findById(payload.id);
    this.logger.log(res);
    return { album: res };
  }

  @GrpcMethod('AlbumService', 'UpdateAlbum')
  async update(@Payload() payload: UpdateAlbumPayloadDto) {
    const { id, ...dto } = payload;
    const res = await this.albumService.update(id, dto);
    this.logger.log(res);
    return { album: res };
  }

  @GrpcMethod('AlbumService', 'DeleteAlbum')
  async delete(@Payload() payload: DeleteAlbumDto) {
    const res = await this.albumService.delete(payload.id);
    this.logger.log(res);
    return undefined;
  }
}
