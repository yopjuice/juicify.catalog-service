import { Genre as DomainGenre } from '../../modules/genre/genre.entity';

// Database object interface
export interface DbGenre {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export class GenreMapper {
  // From Database to Domain
  public static toDomain(raw: DbGenre): DomainGenre {
    return new DomainGenre({
      id: raw.id,
      name: raw.name,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainGenre): DbGenre {
    return {
      id: domain.id,
      name: domain.name,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
