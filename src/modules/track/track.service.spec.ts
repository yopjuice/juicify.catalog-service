import { EntityNotFoundError } from '../../shared/errors/domain-errors';
import { Track } from './track.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { TrackRepo } from '../../infrastrusture/track/track.repo';
import { TrackFixtures } from './fixtures/track.fixture';
import { createTrackRepoMock } from './mocks/track.mock';

describe('TrackService', () => {
  let service: TrackService;
  let repo: TrackRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: TrackRepo,
          useValue: createTrackRepoMock(),
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repo = module.get<TrackRepo>(TrackRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created track', async () => {
      const dto = TrackFixtures.createDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(repo, 'create').mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of tracks', async () => {
      const expected = TrackFixtures.array();
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no tracks are found', async () => {
      const expected = [];
      vi.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an track', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Track);
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(repo, 'findById')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = service.findById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should return the updated track', async () => {
      const dto = TrackFixtures.updateDto();
      const expected = TrackFixtures.entity();
      vi.spyOn(repo, 'update').mockResolvedValue(expected);

      const result = await service.update(expected.id, dto);

      expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the track is not found', async () => {
      const dto = TrackFixtures.updateDto();
      vi
        .spyOn(repo, 'update')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = service.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = TrackFixtures.entity();
      vi.spyOn(repo, 'delete').mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the track is not found', async () => {
      vi
        .spyOn(repo, 'delete')
        .mockRejectedValue(new EntityNotFoundError('track'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
