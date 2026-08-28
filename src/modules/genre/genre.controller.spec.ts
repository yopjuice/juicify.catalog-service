import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Genre } from './genre.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreFixtures } from './fixtures/genre.fixture';
import { createGenreServiceMock } from './mocks/genre.mock';

describe('GenreController', () => {
  let controller: GenreController;
  let service: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: createGenreServiceMock(),
        },
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
    service = module.get<GenreService>(GenreService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created genre', async () => {
      const dto = GenreFixtures.createDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('genre');
      expect(result.genre).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of genres', async () => {
      const expected = GenreFixtures.array();
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('genres');
      expect(result.genres).toEqual(expected);
    });

    it('should return an empty list if no genres are found', async () => {
      const expected = [];
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('genres');
      expect(result.genres).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return an genre', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(service, 'findById').mockResolvedValue(expected);

      const result = await controller.findOne({ id: expected.id });

      expect(service.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toHaveProperty('genre');
      expect(result.genre).toEqual(expected);
      expect(result.genre).toBeInstanceOf(Genre);
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(service, 'findById')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = controller.findOne({ id: 'non-existent-id' });

      expect(service.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated genre', async () => {
      const dto = GenreFixtures.updateDto();
      const expected = GenreFixtures.entity();
      vi.spyOn(service, 'update').mockResolvedValue(expected);

      const result = await controller.update({ id: expected.id, ...dto });

      expect(service.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toHaveProperty('genre');
      expect(result.genre).toEqual(expected);
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(service, 'update')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = controller.update({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.update).toHaveBeenCalledWith('non-existent-id', {});
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = GenreFixtures.entity();
      vi.spyOn(service, 'delete').mockResolvedValue(true);

      const result = await controller.delete({ id: expected.id });

      expect(service.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if the genre is not found', async () => {
      vi
        .spyOn(service, 'delete')
        .mockRejectedValue(new EntityNotFoundError('genre'));

      const result = controller.delete({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
