import { Injectable } from '@nestjs/common';
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateTrackDto } from '../../modules/track/dto/update-track.dto';
import { Track } from '../../modules/track/track.entity';
import { TrackMapper, DbTrack } from './track.mapper';
import { DatabaseProvider } from '../db/db.provider';
import { CreateTrackDto } from '../../modules/track/dto/create-track.dto';
import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { trackFindById } from '../../../sql/queries/generated/track.findById.types';
import { trackCreate } from '../../../sql/queries/generated/track.create.types';
import { trackDelete } from '../../../sql/queries/generated/track.delete.types';
import { trackFindAll } from '../../../sql/queries/generated/track.findall.types';

@Injectable()
export class TrackRepo {
  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Track[]> {
    const rows = await this.db.run(trackFindAll);
    return rows.map((row) => TrackMapper.toDomain(row));
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const row = await this.db.runOne(trackCreate, {
      title: dto.title.trim(),
      duration: dto.duration,
      orderNumber: dto.orderNumber,
      albumId: dto.albumId,
      artistId: dto.artistId,
      pathKey: dto.pathKey,
      coverUrl: dto.coverUrl,
      status: dto.status,
    }) as DbTrack;
    return TrackMapper.toDomain(row);
  }

  async findById(id: string): Promise<Track | null> {
    const result = await this.db.runOne(trackFindById, { id });
    if (!result) return null;
    return TrackMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingTrack = await this.findById(id);

    if (!existingTrack) {
      throw new EntityNotFoundError('track');
    }

    await this.db.runOne(trackDelete, { id })
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const existingTrack = await this.findById(id);

    if (!existingTrack) {
      throw new EntityNotFoundError('track');
    }
    const { query, values } = buildUpdateQuery({
      table: 'tracks',
      data: dto,
      where: { id },
    });

    const result = (await this.db.queryOne<DbTrack>(
      query,
      values,
    )) as DbTrack;
    return TrackMapper.toDomain(result);
  }
}
