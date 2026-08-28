import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateGenreDto } from '../../modules/genre/dto/update-genre.dto';
import { Genre } from '../../modules/genre/genre.entity';
import { GenreMapper, DbGenre } from './genre.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { CreateGenreDto } from '../../modules/genre/dto/create-genre.dto';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { genreFindById } from '../../../sql/queries/generated/genre.findById.types';
import { genreCreate } from '../../../sql/queries/generated/genre.create.types';
import { genreDelete } from '../../../sql/queries/generated/genre.delete.types';
import { genreFindAll } from '../../../sql/queries/generated/genre.findall.types';

@Injectable()
export class GenreRepo {
  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Genre[]> {
    const rows = await this.db.run(genreFindAll);
    return rows.map((row) => GenreMapper.toDomain(row));
  }

  async create(dto: CreateGenreDto): Promise<Genre> {
    const row = await this.db.runOne(genreCreate, {
      name: dto.name,
    }) as DbGenre;
    return GenreMapper.toDomain(row);
  }

  async findById(id: string): Promise<Genre | null> {
    const result = await this.db.runOne(genreFindById, { id });
    if (!result) return null;
    return GenreMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingGenre = await this.findById(id);

    if (!existingGenre) {
      throw new EntityNotFoundError('genre');
    }

    await this.db.runOne(genreDelete, { id })
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateGenreDto): Promise<Genre> {
    const existingGenre = await this.findById(id);

    if (!existingGenre) {
      throw new EntityNotFoundError('genre');
    }
    const { query, values } = buildUpdateQuery({
      table: 'genres',
      data: dto,
      where: { id },
    });

    const result = (await this.db.queryOne<DbGenre>(
      query,
      values,
    )) as DbGenre;
    return GenreMapper.toDomain(result);
  }
}
