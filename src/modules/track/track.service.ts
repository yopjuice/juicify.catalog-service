import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackRepo } from '../../infrastrusture/track/track.repo';
import { Track } from './track.entity';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';

@Injectable()
export class TrackService {
  constructor(private readonly trackRepository: TrackRepo) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.findAll();
  }
  async create(dto: CreateTrackDto): Promise<Track> {
    return this.trackRepository.create(dto);
  }

  async findById(id: string): Promise<Track> {
    const track = await this.trackRepository.findById(id);
    if (!track) throw new EntityNotFoundError('track');
    return track;
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    return this.trackRepository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    await this.trackRepository.delete(id);
    return true;
  }
}
