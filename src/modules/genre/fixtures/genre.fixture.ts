import {
  GenreMapper,
  DbGenre,
} from '../../../infrastrusture/genre/genre.mapper';
import { GenreProps } from '../genre.entity';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { Genre } from '../genre.entity';
import { CreateGenreDto } from '../dto/create-genre.dto';

// Default database object
const baseDbGenre = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  name: 'juice11',
  created_at: new Date('1970-01-01T00:00:00.000Z'),
  updated_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const GenreFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbGenre.id,
  // Generates an Genre entity
  entity: (overrides?: Partial<DbGenre>): Genre =>
    GenreMapper.toDomain({
      ...baseDbGenre,
      ...overrides,
    }),

  // Generates an incoming gRPC DTO payload
  createDto: (overrides?: Partial<CreateGenreDto>): CreateGenreDto => ({
    name: baseDbGenre.name,
    ...overrides,
  }),

  // Generates an incoming gRPC DTO payload
  updateDto: (overrides?: Partial<UpdateGenreDto>): UpdateGenreDto => ({
    name: 'new name',
    ...overrides,
  }),
  // Generates arrays of Genre entities for bulk CRUD operations
  array: (count = 2): Genre[] =>
    Array.from({ length: count }, (_, i) =>
      GenreMapper.toDomain({
        ...baseDbGenre,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbGenre>): DbGenre => ({
    ...baseDbGenre,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbGenre[] =>
    Array.from({ length: count }, (_, i) =>
      GenreFixtures.raw({
        ...baseDbGenre,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Genre entity props
  props: (overrides?: Partial<GenreProps>): GenreProps => ({
    id: 'uuid-123',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
