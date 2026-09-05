import { AlbumRepo } from '../../../infrastrusture/album/album.repo';
import { AlbumService } from '../album.service';
import {Mock} from 'vitest';

export const createAlbumServiceMock = (): Record<
  keyof AlbumService,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createAlbumRepoMock = (): Record<
  keyof AlbumRepo,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
