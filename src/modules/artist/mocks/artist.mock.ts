import { ArtistRepo } from '../../../infrastrusture/artist/artist.repo';
import { ArtistService } from '../artist.service';
import {Mock} from 'vitest';

export const createArtistServiceMock = (): Record<
  keyof ArtistService,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createArtistRepoMock = (): Record<
  keyof ArtistRepo,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
