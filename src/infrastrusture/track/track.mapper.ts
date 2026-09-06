import { Track as DomainTrack, TrackStatus } from '../../modules/track/track.entity';

// Database object interface
export interface DbTrack {
  id: string;
  title: string;
  duration: number;
  order_number: number | null;
  album_id: string | null;
  artist_id: string;
  path_key: string | null;
  cover_url: string | null;
  status: TrackStatus;
  created_at: Date;
  updated_at: Date;
}

export class TrackMapper {
  // From Database to Domain
  public static toDomain(raw: DbTrack): DomainTrack {
    return new DomainTrack({
      id: raw.id,
      title: raw.title,
      duration: raw.duration,
      orderNumber: raw.order_number ?? undefined,
      albumId: raw.album_id ?? undefined,
      artistId: raw.artist_id,
      pathKey: raw.path_key ?? undefined,
      coverUrl: raw.cover_url ?? undefined,
      status: raw.status,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainTrack): DbTrack {
    return {
      id: domain.id,
      title: domain.title,
      duration: domain.duration,
      order_number: domain.orderNumber ?? null,
      album_id: domain.albumId ?? null,
      artist_id: domain.artistId,
      path_key: domain.pathKey ?? null,
      cover_url: domain.coverUrl ?? null,
      status: domain.status,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
