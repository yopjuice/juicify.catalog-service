import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Artist } from '../../modules/artist/artist.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistRepo } from './artist.repo';
import { ArtistFixtures } from '../../modules/artist/fixtures/artist.fixture';
import { DatabaseProvider } from '../../infrastrusture/db/db.provider';
import { createDatabaseProviderMock } from '../../modules/artist/mocks/db.mock';

describe('ArtistRepo', () => {
  let repo: ArtistRepo;
  let dbConfig: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistRepo,
        {
          provide: DatabaseProvider,
          useValue: createDatabaseProviderMock(),
        },
      ],
    }).compile();

    repo = module.get<ArtistRepo>(ArtistRepo);
    dbConfig = module.get<DatabaseProvider>(DatabaseProvider);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should return created artist', async () => {
      const dto = ArtistFixtures.createDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(dbConfig, 'runOne').mockResolvedValue(ArtistFixtures.raw());

      const result = await repo.create(dto);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of artists', async () => {
      const expected = ArtistFixtures.array();
      jest
        .spyOn(dbConfig, 'run')
        .mockResolvedValue(ArtistFixtures.rawArray());

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no artists are found', async () => {
      const expected = [];
      jest.spyOn(dbConfig, 'run').mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(dbConfig.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an artist', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(dbConfig, 'runOne').mockResolvedValue(ArtistFixtures.raw());

      const result = await repo.findById(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Artist);
    });

    it('should return null if the artist is not found', async () => {
      const expected = null;
      jest.spyOn(dbConfig, 'runOne').mockResolvedValue(null);

      const result = await repo.findById('non-existent-id');

      expect(dbConfig.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should return the updated artist', async () => {
      const dto = ArtistFixtures.updateDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(dbConfig, 'runOne').mockResolvedValue(ArtistFixtures.raw());
      
      jest.spyOn(dbConfig, 'queryOne').mockResolvedValue(ArtistFixtures.raw());

      const result = await repo.update(expected.id, dto);

      expect(dbConfig.queryOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should throw an error if the artist is not found', async () => {
      const dto = ArtistFixtures.updateDto();
      jest
        .spyOn(dbConfig, 'queryOne')
        .mockRejectedValue(new EntityNotFoundError('artist'));

      const result = repo.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(dbConfig, 'runOne').mockResolvedValue(ArtistFixtures.raw());

      const result = await repo.delete(expected.id);

      expect(dbConfig.runOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(true);
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(dbConfig, 'runOne')
        .mockRejectedValue(new EntityNotFoundError('artist'));

      const result = repo.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(dbConfig.runOne).toHaveBeenCalled();
    });
  });
});
