import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateAlbumDto } from '../../modules/album/dto/update-album.dto';
import { Album, AlbumType } from '../../modules/album/album.entity';
import { AlbumMapper, DbAlbum } from './album.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { CreateAlbumDto } from '../../modules/album/dto/create-album.dto';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { albumFindById } from '../../../sql/queries/generated/album.findById.types';
import { albumCreate } from '../../../sql/queries/generated/album.create.types';
import { albumDelete } from '../../../sql/queries/generated/album.delete.types';
import { albumFindAll } from '../../../sql/queries/generated/album.findall.types';

@Injectable()
export class AlbumRepo {
  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Album[]> {
    const rows = await this.db.run(albumFindAll);
    return rows.map((row) => AlbumMapper.toDomain(row));
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const row = await this.db.runOne(albumCreate, {
      title: dto.title,
      release_date: dto.releaseDate,
      cover_url: dto.coverUrl || null,
      type: dto.type || AlbumType.Single,
      genre_id: dto.genreId,
      artist_id: dto.artistId,
    }) as DbAlbum;
    return AlbumMapper.toDomain(row);
  }

  async findById(id: string): Promise<Album | null> {
    const result = await this.db.runOne(albumFindById, { id });
    if (!result) return null;
    return AlbumMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingAlbum = await this.findById(id);

    if (!existingAlbum) {
      throw new EntityNotFoundError('album');
    }

    await this.db.runOne(albumDelete, { id })
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const existingAlbum = await this.findById(id);

    if (!existingAlbum) {
      throw new EntityNotFoundError('album');
    }
    const { query, values } = buildUpdateQuery({
      table: 'albums',
      data: dto,
      where: { id },
    });

    const result = (await this.db.queryOne<DbAlbum>(
      query,
      values,
    )) as DbAlbum;
    return AlbumMapper.toDomain(result);
  }
}
