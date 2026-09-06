import {
  TrackMapper,
  DbTrack,
} from '../../../infrastrusture/track/track.mapper';
import { TrackProps, TrackStatus } from '../track.entity';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { Track } from '../track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';

// Default database object
const baseDbTrack = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  title: 'Track title',
  duration: 123,
  order_number: 1,
  album_id: null,
  artist_id: 'cfd5-954f-46a1-bdb5-b4006a24ffcd',
  path_key: 'path/to/track',
  cover_url: 'path/to/cover',
  status: TrackStatus.Ready,
  created_at: new Date('1970-01-01T00:00:00.000Z'),
  updated_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const TrackFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbTrack.id,
  // Generates an Track entity
  entity: (overrides?: Partial<DbTrack>): Track =>
    TrackMapper.toDomain({
      ...baseDbTrack,
      ...overrides,
    }),

  // Generates an incoming gRPC DTO payload
  createDto: (overrides?: Partial<CreateTrackDto>): CreateTrackDto => ({
    title: baseDbTrack.title,
    duration: baseDbTrack.duration,
    orderNumber: baseDbTrack.order_number,
    albumId: baseDbTrack.album_id ?? undefined,
    artistId: baseDbTrack.artist_id,
    pathKey: baseDbTrack.path_key,
    coverUrl: baseDbTrack.cover_url,
    status: baseDbTrack.status,
    ...overrides,
  }),

  // Generates an incoming gRPC DTO payload
  updateDto: (overrides?: Partial<UpdateTrackDto>): UpdateTrackDto => ({
    title: 'updated title',
    ...overrides,
  }),
  // Generates arrays of Track entities for bulk CRUD operations
  array: (count = 2): Track[] =>
    Array.from({ length: count }, (_, i) =>
      TrackMapper.toDomain({
        ...baseDbTrack,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbTrack>): DbTrack => ({
    ...baseDbTrack,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbTrack[] =>
    Array.from({ length: count }, (_, i) =>
      TrackFixtures.raw({
        ...baseDbTrack,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Track entity props
  props: (overrides?: Partial<TrackProps>): TrackProps => ({
    id: 'uuid-123',
    title: 'title',
    duration: 123,
    orderNumber: 1,
    albumId: 'f6a1-bdb5-b4006a24ffcd',
    artistId: 'cfd5-954f-46a1-bdb5-b4006a24ffcd',
    pathKey: 'path/to/track',
    coverUrl: 'path/to/cover',
    status: TrackStatus.Ready,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
