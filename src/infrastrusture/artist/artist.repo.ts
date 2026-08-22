import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateArtistDto } from '../../modules/artist/dto/update-artist.dto';
import { Artist } from '../../modules/artist/artist.entity';
import { ArtistMapper, DbArtist } from './artist.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { CreateArtistDto } from '../../modules/artist/dto/create-artist.dto';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { artistFindById } from '../../../sql/queries/generated/artist.findById.types';
import { artistCreate } from '../../../sql/queries/generated/artist.create.types';
import { artistDelete } from '../../../sql/queries/generated/artist.delete.types';
import { artistFindAll } from '../../../sql/queries/generated/artist.findall.types';

@Injectable()
export class ArtistRepo {
  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Artist[]> {
    const rows = await this.db.run(artistFindAll);
    return rows.map((row) => ArtistMapper.toDomain(row));
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    const row = await this.db.runOne(artistCreate, {
      name: dto.name,
      biography: dto.biography || null,
      avatar_url: dto.avatarUrl || null,
      is_verified: dto.isVerified || false,
    }) as DbArtist;
    return ArtistMapper.toDomain(row);
  }

  async findById(id: string): Promise<Artist | null> {
    const result = await this.db.runOne(artistFindById, { id });
    if (!result) return null;
    return ArtistMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingArtist = await this.findById(id);

    if (!existingArtist) {
      throw new EntityNotFoundError('artist');
    }

    await this.db.runOne(artistDelete, { id })
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const existingArtist = await this.findById(id);

    if (!existingArtist) {
      throw new EntityNotFoundError('artist');
    }
    const { query, values } = buildUpdateQuery({
      table: 'artists',
      data: dto,
      where: { id },
    });

    const result = (await this.db.queryOne<DbArtist>(
      query,
      values,
    )) as DbArtist;
    return ArtistMapper.toDomain(result);
  }
}
