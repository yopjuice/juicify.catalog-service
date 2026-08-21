import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { buildUpdateQuery } from '../../shared/utils/sql-update-builder';
import { UpdateArtistDto } from '../../modules/artist/dto/update-artist.dto';
import { Artist } from '../../modules/artist/artist.entity.js';
import { ArtistMapper, DbArtist } from './artist.mapper.js';
import { loadSql } from '../../shared/utils/load-sql.js';
import { DatabaseProvider } from '../db/db.provider';
import { CreateArtistDto } from "../../modules/artist/dto/create-artist.dto.js";

@Injectable()
export class ArtistRepo {

  constructor(
    private readonly db: DatabaseProvider,
    // private readonly logger: any,
  ) { }

  async findAll(): Promise<Artist[]> {
    const sql = loadSql('artist', 'artist.findall.sql');
    const rows = await this.db.query<DbArtist>(sql);
    return rows.map(row => ArtistMapper.toDomain(row));
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
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
    const row = await this.db.queryOne<DbArtist>(sql, values) as DbArtist;
    return ArtistMapper.toDomain(row);
  }

  async findById(id: string): Promise<Artist | null> {
    const query = `
      SELECT * FROM artists WHERE id = $1
    `;
    const result = await this.db.queryOne<DbArtist>(query, [id]);
    if (!result) return null;
    return ArtistMapper.toDomain(result);
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const existingArtist = await this.findById(id);

    if (!existingArtist) {
      throw new RpcException({
        code: 5, // status.NOT_FOUND
        message: `Artist with ID ${id} not found`
      });
    }
    const query = `
      DELETE FROM artists WHERE id = $1
    `;

    await this.db.queryOne(query, [id]);
    return true;
  }

  // PARTIAL UPDATE
  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {

    const existingArtist = await this.findById(id);

    if (!existingArtist) {
      throw new RpcException({
        code: 5, // status.NOT_FOUND
        message: `Artist with ID ${id} not found`
      });
    }
    const { query, values } = buildUpdateQuery({
      table: 'artists',
      data: dto,
      where: { id },
    });

    const result = await this.db.queryOne<DbArtist>(query, values) as DbArtist;
    return ArtistMapper.toDomain(result);

  }
}
