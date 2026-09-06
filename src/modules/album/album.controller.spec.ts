import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Album } from './album.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumFixtures } from './fixtures/album.fixture';
import { createAlbumServiceMock } from './mocks/album.mock';

describe('AlbumController', () => {
  let controller: AlbumController;
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        {
          provide: AlbumService,
          useValue: createAlbumServiceMock(),
        },
      ],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
    service = module.get<AlbumService>(AlbumService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created album', async () => {
      const dto = AlbumFixtures.createDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('album');
      expect(result.album).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of albums', async () => {
      const expected = AlbumFixtures.array();
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('albums');
      expect(result.albums).toEqual(expected);
    });

    it('should return an empty list if no albums are found', async () => {
      const expected = [];
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('albums');
      expect(result.albums).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return an album', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(service, 'findById').mockResolvedValue(expected);

      const result = await controller.findOne({ id: expected.id });

      expect(service.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toHaveProperty('album');
      expect(result.album).toEqual(expected);
      expect(result.album).toBeInstanceOf(Album);
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(service, 'findById')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = controller.findOne({ id: 'non-existent-id' });

      expect(service.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated album', async () => {
      const dto = AlbumFixtures.updateDto();
      const expected = AlbumFixtures.entity();
      vi.spyOn(service, 'update').mockResolvedValue(expected);

      const result = await controller.update({ id: expected.id, ...dto });

      expect(service.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toHaveProperty('album');
      expect(result.album).toEqual(expected);
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(service, 'update')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = controller.update({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.update).toHaveBeenCalledWith('non-existent-id', {});
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = AlbumFixtures.entity();
      vi.spyOn(service, 'delete').mockResolvedValue(true);

      const result = await controller.delete({ id: expected.id });

      expect(service.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if the album is not found', async () => {
      vi
        .spyOn(service, 'delete')
        .mockRejectedValue(new EntityNotFoundError('album'));

      const result = controller.delete({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
