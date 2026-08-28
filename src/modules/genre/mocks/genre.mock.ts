import { GenreRepo } from '../../../infrastrusture/genre/genre.repo';
import { GenreService } from '../genre.service';
import { Mock } from 'vitest';

export const createGenreServiceMock = (): Record<
  keyof GenreService,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createGenreRepoMock = (): Record<
  keyof GenreRepo,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
