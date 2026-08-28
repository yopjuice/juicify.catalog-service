import {
  AlbumMapper,
  DbAlbum,
} from '../../../infrastrusture/album/album.mapper';
import { AlbumProps, AlbumType } from '../album.entity';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { Album } from '../album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';

// Default database object
const baseDbAlbum = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  title: 'Greatest Album',
  release_date: new Date('1970-01-01T00:00:00.000Z'),
  cover_url: 'https://example.com',
  type: 'EP',
  genre_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  artist_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  created_at: new Date('1970-01-01T00:00:00.000Z'),
  updated_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const AlbumFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbAlbum.id,
  // Generates an Album entity
  entity: (overrides?: Partial<DbAlbum>): Album =>
    AlbumMapper.toDomain({
      ...baseDbAlbum,
      ...overrides,
    }),

  // Generates an incoming gRPC DTO payload
  createDto: (overrides?: Partial<CreateAlbumDto>): CreateAlbumDto => ({
    title: baseDbAlbum.title,
    releaseDate: baseDbAlbum.release_date.toISOString(),
    type: baseDbAlbum.type,
    coverUrl: baseDbAlbum.cover_url,
    genreId: baseDbAlbum.genre_id,
    artistId: baseDbAlbum.artist_id,
    ...overrides,
  }),

  // Generates an incoming gRPC DTO payload
  updateDto: (overrides?: Partial<UpdateAlbumDto>): UpdateAlbumDto => ({
    title: 'updated title',
    ...overrides,
  }),
  // Generates arrays of Album entities for bulk CRUD operations
  array: (count = 2): Album[] =>
    Array.from({ length: count }, (_, i) =>
      AlbumMapper.toDomain({
        ...baseDbAlbum,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbAlbum>): DbAlbum => ({
    ...baseDbAlbum,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbAlbum[] =>
    Array.from({ length: count }, (_, i) =>
      AlbumFixtures.raw({
        ...baseDbAlbum,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Album entity props
  props: (overrides?: Partial<AlbumProps>): AlbumProps => ({
    id: 'uuid-123',
    title: 'Greatest Album',
    releaseDate: new Date(),
    coverUrl: 'https://example.com',
    type: AlbumType.EP,
    genreId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    artistId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
