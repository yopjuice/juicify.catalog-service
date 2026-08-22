import { DatabaseProvider } from '../../../infrastrusture/db/db.provider';

export const createDatabaseProviderMock = (): Record<
  keyof DatabaseProvider,
  jest.Mock
> => ({
  query: jest.fn(),
  queryOne: jest.fn(),
  onApplicationShutdown: jest.fn(),
  run: jest.fn(),
  runOne: jest.fn(),
  runInTransaction: jest.fn(),
});
