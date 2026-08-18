import { Artist as DomainArtist } from '../../modules/artist/artist.entity.js';

// Database object
export interface DbArtist {
  id: string;
  name: string;
  biography: string | null;
  is_verified: boolean;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export class ArtistMapper {
  // From Database to Domain
  public static toDomain(raw: DbArtist): DomainArtist {
    return new DomainArtist({
      id: raw.id,
      name: raw.name,
      biography: raw.biography,
      isVerified: raw.is_verified,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainArtist): DbArtist {
    return {
      id: domain.id,
      name: domain.name,
      biography: domain.biography,
      is_verified: domain.isVerified,
      avatar_url: domain.avatarUrl,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
