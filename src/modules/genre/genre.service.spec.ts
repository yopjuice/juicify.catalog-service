import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Genre } from './genre.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { GenreRepo } from '../../infrastrusture/genre/genre.repo';
import { GenreFixtures } from './fixtures/genre.fixture';
import { createGenreRepoMock } from './mocks/genre.mock';

describe('GenreService', () => {
  let service: GenreService;
  let repo: GenreRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: GenreRepo,
          useValue: createGenreRepoMock(),
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
    repo = module.get<GenreRepo>(GenreRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created genre', async () => {
      const dto = GenreFixtures.createDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(repo, 'create').mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of genres', async () => {
      const expected = GenreFixtures.array();
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no genres are found', async () => {
      const expected = [];
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an genre', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Genre);
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(repo, 'findById')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = service.findById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated genre', async () => {
      const dto = GenreFixtures.updateDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(repo, 'update').mockResolvedValue(expected);

      const result = await service.update(expected.id, dto);

      expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the genre is not found', async () => {
      const dto = GenreFixtures.updateDto();
      vi
        .spyOn(repo, 'update')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = service.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(repo, 'delete').mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(repo, 'delete')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
