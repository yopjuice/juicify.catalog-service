import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Track } from './track.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackFixtures } from './fixtures/track.fixture';
import { createTrackServiceMock } from './mocks/track.mock';

describe('TrackController', () => {
  let controller: TrackController;
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        {
          provide: TrackService,
          useValue: createTrackServiceMock(),
        },
      ],
    }).compile();

    controller = module.get<TrackController>(TrackController);
    service = module.get<TrackService>(TrackService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created track', async () => {
      const dto = TrackFixtures.createDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('track');
      expect(result.track).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of tracks', async () => {
      const expected = TrackFixtures.array();
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('tracks');
      expect(result.tracks).toEqual(expected);
    });

    it('should return an empty list if no tracks are found', async () => {
      const expected = [];
      vi.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('tracks');
      expect(result.tracks).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return an track', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(service, 'findById').mockResolvedValue(expected);

      const result = await controller.findOne({ id: expected.id });

      expect(service.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toHaveProperty('track');
      expect(result.track).toEqual(expected);
      expect(result.track).toBeInstanceOf(Track);
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(service, 'findById')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = controller.findOne({ id: 'non-existent-id' });

      expect(service.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated track', async () => {
      const dto = TrackFixtures.updateDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(service, 'update').mockResolvedValue(expected);

      const result = await controller.update({ id: expected.id, ...dto });

      expect(service.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toHaveProperty('track');
      expect(result.track).toEqual(expected);
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(service, 'update')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = controller.update({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.update).toHaveBeenCalledWith('non-existent-id', {});
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(service, 'delete').mockResolvedValue(true);

      const result = await controller.delete({ id: expected.id });

      expect(service.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(service, 'delete')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = controller.delete({ id: 'non-existent-id' });

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(service.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
