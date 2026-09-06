import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Track } from '../../modules/track/track.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackRepo } from './track.repo';
import { TrackFixtures } from '../../modules/track/fixtures/track.fixture';
import { DatabaseProvider } from '../../infrastrusture/db/db.provider';
import { createDatabaseProviderMock } from '../../modules/track/mocks/db.mock';

describe('TrackRepo', () => {
  let repo: TrackRepo;
  let dbConfig: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackRepo,
        {
          provide: DatabaseProvider,
          useValue: createDatabaseProviderMock(),
        },
      ],
    }).compile();

    repo = module.get<TrackRepo>(TrackRepo);
    dbConfig = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should return created track', async () => {
      const dto = TrackFixtures.createDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TrackFixtures.raw());

      const result = await repo.create(dto);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of tracks', async () => {
      const expected = TrackFixtures.array();
      vi
        .spyOn(dbConfig, 'run')
        .mockResolvedValue(TrackFixtures.rawArray());

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no tracks are found', async () => {
      const expected = [];
      vi.spyOn(dbConfig, 'run').mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an track', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TrackFixtures.raw());

      const result = await repo.findById(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Track);
    });

    it('should return null if the track is not found', async () => {
      const expected = null;
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(null);

      const result = await repo.findById('non-existent-id');

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return the updated track', async () => {
      const dto = TrackFixtures.updateDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TrackFixtures.raw());
      
      vi.spyOn(dbConfig, 'queryOne').mockResolvedValue(TrackFixtures.raw());

      const result = await repo.update(expected.id, dto);

      expect(dbConfig.queryOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should throw an error if the track is not found', async () => {
      const dto = TrackFixtures.updateDto();
      vi
        .spyOn(dbConfig, 'queryOne')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = repo.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(TrackFixtures.raw());

      const result = await repo.delete(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(true);
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(dbConfig, 'runOne')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = repo.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalled();
    });
  });
});
