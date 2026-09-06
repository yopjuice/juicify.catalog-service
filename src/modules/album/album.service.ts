import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumRepo } from '../../infrastrusture/album/album.repo';
import { Album } from './album.entity';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';

@Injectable()
export class AlbumService {
  constructor(private readonly albumRepository: AlbumRepo) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.findAll();
  }
  async create(dto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.create(dto);
  }

  async findById(id: string): Promise<Album> {
    const album = await this.albumRepository.findById(id);
    if (!album) throw new EntityNotFoundError('album');
    return album;
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    return this.albumRepository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    await this.albumRepository.delete(id);
    return true;
  }
}
