import { Artist as DomainArtist } from '../../modules/artist/artist.entity';

// Database object interface
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
      biography: raw.biography ?? undefined,
      isVerified: raw.is_verified,
      avatarUrl: raw.avatar_url ?? undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainArtist): DbArtist {
    return {
      id: domain.id,
      name: domain.name,
      biography: domain.biography ?? null,
      is_verified: domain.isVerified,
      avatar_url: domain.avatarUrl ?? null,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
