import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreRepo } from '../../infrastrusture/genre/genre.repo';
import { Genre } from './genre.entity';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepo) {}

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.findAll();
  }
  async create(dto: CreateGenreDto): Promise<Genre> {
    return this.genreRepository.create(dto);
  }

  async findById(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findById(id);
    if (!genre) throw new EntityNotFoundError('genre');
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto): Promise<Genre> {
    return this.genreRepository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    await this.genreRepository.delete(id);
    return true;
  }
}
