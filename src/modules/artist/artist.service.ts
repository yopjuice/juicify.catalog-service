import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistRepo } from '../../infrastrusture/artist/artist.repo';
import { Artist } from './artist.entity';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepo) { }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.findAll();
  }
  async create(dto: CreateArtistDto): Promise<Artist> {
    return this.artistRepository.create(dto);
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findById(id);
    if (!artist)
      throw new EntityNotFoundError('artist');
    return artist;
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    return this.artistRepository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    await this.artistRepository.delete(id);
    return true;
  }
}
