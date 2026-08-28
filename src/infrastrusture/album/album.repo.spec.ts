import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Album } from '../../modules/album/album.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumRepo } from './album.repo';
import { AlbumFixtures } from '../../modules/album/fixtures/album.fixture';
import { DatabaseProvider } from '../../infrastrusture/db/db.provider';
import { createDatabaseProviderMock } from '../../modules/album/mocks/db.mock';

describe('AlbumRepo', () => {
  let repo: AlbumRepo;
  let dbConfig: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumRepo,
        {
          provide: DatabaseProvider,
          useValue: createDatabaseProviderMock(),
        },
      ],
    }).compile();

    repo = module.get<AlbumRepo>(AlbumRepo);
    dbConfig = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should return created album', async () => {
      const dto = AlbumFixtures.createDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(AlbumFixtures.raw());

      const result = await repo.create(dto);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of albums', async () => {
      const expected = AlbumFixtures.array();
      vi
        .spyOn(dbConfig, 'run')
        .mockResolvedValue(AlbumFixtures.rawArray());

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no albums are found', async () => {
      const expected = [];
      vi.spyOn(dbConfig, 'run').mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an album', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(AlbumFixtures.raw());

      const result = await repo.findById(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Album);
    });

    it('should return null if the album is not found', async () => {
      const expected = null;
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(null);

      const result = await repo.findById('non-existent-id');

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return the updated album', async () => {
      const dto = AlbumFixtures.updateDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(AlbumFixtures.raw());
      
      vi.spyOn(dbConfig, 'queryOne').mockResolvedValue(AlbumFixtures.raw());

      const result = await repo.update(expected.id, dto);

      expect(dbConfig.queryOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should throw an error if the album is not found', async () => {
      const dto = AlbumFixtures.updateDto();
      vi
        .spyOn(dbConfig, 'queryOne')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = repo.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(AlbumFixtures.raw());

      const result = await repo.delete(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(true);
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(dbConfig, 'runOne')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = repo.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalled();
    });
  });
});
