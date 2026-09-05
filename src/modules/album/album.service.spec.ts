import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Album } from './album.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { AlbumRepo } from '../../infrastrusture/album/album.repo';
import { AlbumFixtures } from './fixtures/album.fixture';
import { createAlbumRepoMock } from './mocks/album.mock';

describe('AlbumService', () => {
  let service: AlbumService;
  let repo: AlbumRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        {
          provide: AlbumRepo,
          useValue: createAlbumRepoMock(),
        },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repo = module.get<AlbumRepo>(AlbumRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created album', async () => {
      const dto = AlbumFixtures.createDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(repo, 'create').mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of albums', async () => {
      const expected = AlbumFixtures.array();
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no albums are found', async () => {
      const expected = [];
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an album', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Album);
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(repo, 'findById')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = service.findById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated album', async () => {
      const dto = AlbumFixtures.updateDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(repo, 'update').mockResolvedValue(expected);

      const result = await service.update(expected.id, dto);

      expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the album is not found', async () => {
      const dto = AlbumFixtures.updateDto();
      vi
        .spyOn(repo, 'update')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = service.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(repo, 'delete').mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(repo, 'delete')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
