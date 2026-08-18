import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistRepository } from '../../infrastrusture/artist/artist.repo';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepository) { }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.findAll();
  }
  // async create(dto: CreateArtistDto): Promise<Artist> {
  //   return this.artistRepository.create(dto);
  // }
  //
  //
  // async findById(id: string): Promise<Artist> {
  //   return this.artistRepository.findById(id)
  // }
  //
  // async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
  //   return this.artistRepository.update(id, dto);
  // }
  //
  // async delete(id: string): Promise<boolean> {
  //   await this.artistRepository.delete(id);
  //   return true;
  // }
}
