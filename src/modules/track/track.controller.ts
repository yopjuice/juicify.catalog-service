import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackPayloadDto } from './dto/update-track.dto';
import type { PingResponse } from '@juice11-micro/contracts';
import { DeleteTrackDto } from './dto/delete-track.dto';
import { GetTrackDto } from './dto/get-track.dto';
import { Logger } from '@nestjs/common';

@Controller()
export class TrackController {
  private readonly logger = new Logger(TrackController.name);

  constructor(private readonly trackService: TrackService) {}

  // Simple ping handler for testing
  // TODO:move this elsewhere or remove
  @GrpcMethod('CatalogService', 'Ping')
  ping(): PingResponse {
    this.logger.log('Ping');
    return { ok: true };
  }
  @GrpcMethod('TrackService', 'ListTracks')
  async findAll() {
    const res = await this.trackService.findAll();
    this.logger.log(res);

    return { tracks: res };
  }

  @GrpcMethod('TrackService', 'CreateTrack')
  async create(@Payload() payload: CreateTrackDto) {
    const res = await this.trackService.create(payload);
    return { track: res };
  }

  @GrpcMethod('TrackService', 'GetTrack')
  async findOne(@Payload() payload: GetTrackDto) {
    const res = await this.trackService.findById(payload.id);
    this.logger.log(res);
    return { track: res };
  }

  @GrpcMethod('TrackService', 'UpdateTrack')
  async update(@Payload() payload: UpdateTrackPayloadDto) {
    const { id, ...dto } = payload;
    const res = await this.trackService.update(id, dto);
    this.logger.log(res);
    return { track: res };
  }

  @GrpcMethod('TrackService', 'DeleteTrack')
  async delete(@Payload() payload: DeleteTrackDto) {
    const res = await this.trackService.delete(payload.id);
    this.logger.log(res);
    return undefined;
  }
}
