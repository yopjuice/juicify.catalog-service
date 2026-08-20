import { ArtistMapper, DbArtist } from '../../../infrastrusture/artist/artist.mapper';
import { UpdateArtistDto } from "../dto/update-artist.dto";
import { Artist } from '../artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';

// Default base object 
const baseDbArtist = {
  id: "5176cfd5-954f-46a1-bdb5-b4006a24ffcd",
  name: "juice11",
  is_verified: false,
  biography: 'The greatest artist of all time',
  avatar_url: 'https://i.imgur.com/wSTFkRM.png',
  created_at: new Date("1970-01-01T00:00:00.000Z"),
  updated_at: new Date("1970-01-01T00:00:00.000Z"),
} as const;

export const ArtistFixtures = {
  // Generates an Artist entity
  entity: (overrides?: Partial<DbArtist>): Artist => ArtistMapper.toDomain({
    ...baseDbArtist,
    ...overrides,
  }),

  // Generates an incoming gRPC DTO payload
  createDto: (overrides?: Partial<CreateArtistDto>): CreateArtistDto => ({
    name: baseDbArtist.name,
    biography: baseDbArtist.biography,
    isVerified: baseDbArtist.is_verified,
    avatarUrl: baseDbArtist.avatar_url,
    ...overrides,
  }),

  updateDto: (overrides?: Partial<UpdateArtistDto>): UpdateArtistDto => ({
    biography: 'updated biography',
    ...overrides,
  }),
  // Generates arrays for bulk CRUD operations
  array: (count = 2): Artist[] =>
    Array.from({ length: count }, (_, i) => ArtistMapper.toDomain({
      ...baseDbArtist,
      id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`
    })),
};

