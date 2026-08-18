import { Injectable } from "@nestjs/common";
import {Artist} from '../../modules/artist/artist.entity.js';
import {ArtistMapper, DbArtist} from './artist.mapper.js';
import {loadSql} from '../../shared/utils/load-sql.js';
import { DatabaseProvider } from '../db/db.provider';

@Injectable()
export class ArtistRepository {

  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Artist[]> {
    try {
      const sql = loadSql('artist', 'artist.findall.sql');
      const rows = await this.db.query<DbArtist>(sql);
      return rows.map(row => ArtistMapper.toDomain(row));
    } catch (error) {
      // this.logger.error('Failed to fetch all users', error);
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  }

}
