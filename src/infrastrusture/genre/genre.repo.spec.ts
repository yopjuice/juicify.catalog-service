import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Genre } from '../../modules/genre/genre.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GenreRepo } from './genre.repo';
import { GenreFixtures } from '../../modules/genre/fixtures/genre.fixture';
import { DatabaseProvider } from '../../infrastrusture/db/db.provider';
import { createDatabaseProviderMock } from '../../modules/genre/mocks/db.mock';

describe('GenreRepo', () => {
  let repo: GenreRepo;
  let dbConfig: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreRepo,
        {
          provide: DatabaseProvider,
          useValue: createDatabaseProviderMock(),
        },
      ],
    }).compile();

    repo = module.get<GenreRepo>(GenreRepo);
    dbConfig = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should return created genre', async () => {
      const dto = GenreFixtures.createDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(GenreFixtures.raw());

      const result = await repo.create(dto);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of genres', async () => {
      const expected = GenreFixtures.array();
      vi
        .spyOn(dbConfig, 'run')
        .mockResolvedValue(GenreFixtures.rawArray());

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no genres are found', async () => {
      const expected = [];
      vi.spyOn(dbConfig, 'run').mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an genre', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(GenreFixtures.raw());

      const result = await repo.findById(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Genre);
    });

    it('should return null if the genre is not found', async () => {
      const expected = null;
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(null);

      const result = await repo.findById('non-existent-id');

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return the updated genre', async () => {
      const dto = GenreFixtures.updateDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(GenreFixtures.raw());
      
      vi.spyOn(dbConfig, 'queryOne').mockResolvedValue(GenreFixtures.raw());

      const result = await repo.update(expected.id, dto);

      expect(dbConfig.queryOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should throw an error if the genre is not found', async () => {
      const dto = GenreFixtures.updateDto();
      vi
        .spyOn(dbConfig, 'queryOne')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = repo.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(dbConfig, 'runOne').mockResolvedValue(GenreFixtures.raw());

      const result = await repo.delete(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(true);
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(dbConfig, 'runOne')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = repo.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalled();
    });
  });
});
