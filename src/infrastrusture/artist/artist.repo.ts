import { Injectable } from "@nestjs/common";
import { buildUpdateQuery } from '../../shared/utils/sql-builder.js';
import { UpdateArtistDto } from '../../modules/artist/dto/update-artist.dto.js';
import { Artist } from '../../modules/artist/artist.entity.js';
import { ArtistMapper, DbArtist } from './artist.mapper.js';
import { loadSql } from '../../shared/utils/load-sql.js';
import { DatabaseProvider } from '../db/db.provider';
import { CreateArtistDto } from "../../modules/artist/dto/create-artist.dto.js";

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

  async create(dto: CreateArtistDto): Promise<Artist> {
    console.log(dto);
    const sql = `
      INSERT INTO artists (
        name, biography, avatar_url, is_verified, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      dto.name,
      dto.biography || null,
      dto.avatarUrl || null,
      dto.isVerified || false,
    ];
    try {

      const row = await this.db.queryOne<DbArtist>(sql, values);
      return ArtistMapper.toDomain(row);
    } catch (error) {
      throw new Error(`Failed to create artist: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Artist | null> {
    const query = `
      SELECT * FROM artists WHERE id = $1
    `;
    try {
      const result = await this.db.queryOne(query, [id]);
      return result || null;
    } catch (e) {
      throw new Error(`Failed to find artist by id: ${e.message}`);
    }
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM artists WHERE id = $1
    `;

    try {
      await this.db.query(query, [id]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete artist: ${error.message}`);
    }
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateArtistDto): Promise<Artist | null> {
    if (Object.keys(dto).length === 0) {
      return this.findById(id);
    }

    const { query, values } = buildUpdateQuery({
      table: 'artists',
      data: dto,
      where: { id },
    });

    try {
      const result = await this.db.query(query, values);
      return result.length > 0 ? ArtistMapper.toDomain(result[0]) : null;
    } catch (e) {
      throw new Error(`Failed to update artist: ${e.message}`);
    }

  }
}
