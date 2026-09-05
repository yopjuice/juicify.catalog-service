import { AlbumType, Album as DomainAlbum } from '../../modules/album/album.entity';

// Database object interface
export interface DbAlbum {
  id: string;
  title: string;
  release_date: Date | null;
  cover_url: string | null;
  type: AlbumType;
  genre_id: string;
  artist_id: string;
  created_at: Date;
  updated_at: Date;
}

export class AlbumMapper {
  // From Database to Domain
  public static toDomain(raw: DbAlbum): DomainAlbum {
    return new DomainAlbum({
      id: raw.id,
      title: raw.title,
      releaseDate: raw.release_date ?? undefined,
      coverUrl: raw.cover_url ?? undefined,
      type: raw.type,
      genreId: raw.genre_id,
      artistId: raw.artist_id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainAlbum): DbAlbum {
    return {
      id: domain.id,
      title: domain.title,
      release_date: domain.releaseDate ?? null,
      cover_url: domain.coverUrl ?? null,
      type: domain.type,
      genre_id: domain.genreId,
      artist_id: domain.artistId,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
