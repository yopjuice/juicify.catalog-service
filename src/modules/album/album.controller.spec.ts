import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Artist } from './artist.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistFixtures } from './fixtures/artist.fixture';
import { createArtistServiceMock } from './mocks/artist.mock';

describe('ArtistController', () => {
  let controller: ArtistController;
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        {
          provide: ArtistService,
          useValue: createArtistServiceMock(),
        },
      ],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created artist', async () => {
      const dto = ArtistFixtures.createDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('artist');
      expect(result.artist).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of artists', async () => {
      const expected = ArtistFixtures.array();
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('artists');
      expect(result.artists).toEqual(expected);
    });

    it('should return an empty list if no artists are found', async () => {
      const expected = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('artists');
      expect(result.artists).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return an artist', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(service, 'findById').mockResolvedValue(expected);

      const result = await controller.findOne({ id: expected.id });

      expect(service.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toHaveProperty('artist');
      expect(result.artist).toEqual(expected);
      expect(result.artist).toBeInstanceOf(Artist);
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new EntityNotFoundError('artist'));

      const result = controller.findOne({ id: 'non-existent-id' });

      expect(service.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated artist', async () => {
      const dto = ArtistFixtures.updateDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(service, 'update').mockResolvedValue(expected);

      const result = await controller.update({ id: expected.id, ...dto });

      expect(service.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toHaveProperty('artist');
      expect(result.artist).toEqual(expected);
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new EntityNotFoundError('artist'));

      const result = controller.update({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.update).toHaveBeenCalledWith('non-existent-id', {});
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(service, 'delete').mockResolvedValue(true);

      const result = await controller.delete({ id: expected.id });

      expect(service.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new EntityNotFoundError('artist'));

      const result = controller.delete({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
