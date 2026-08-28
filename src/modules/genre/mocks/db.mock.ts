import { DatabaseProvider } from '../../../infrastrusture/db/db.provider';
import { vi, Mock } from 'vitest';

// TODO: move this to shared mocks
export const createDatabaseProviderMock = (): Record<
  keyof DatabaseProvider,
  Mock
> => ({
  query: vi.fn(),
  queryOne: vi.fn(),
  onApplicationShutdown: vi.fn(),
  run: vi.fn(),
  runOne: vi.fn(),
  runInTransaction: vi.fn(),
});
