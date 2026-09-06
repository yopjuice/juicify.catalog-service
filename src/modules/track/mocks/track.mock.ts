import { TrackRepo } from '../../../infrastrusture/track/track.repo';
import { TrackService } from '../track.service';
import {Mock} from 'vitest';

export const createTrackServiceMock = (): Record<
  keyof TrackService,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createTrackRepoMock = (): Record<
  keyof TrackRepo,
  Mock
> => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
