import { RpcException } from '@nestjs/microservices';
import { Artist } from './artist.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { ArtistRepo } from '../../infrastrusture/artist/artist.repo';
import { ArtistFixtures } from './fixtures/artist.fixture';
import { createArtistRepoMock } from './mocks/artist.mock';

describe('ArtistService', () => {
  let service: ArtistService;
  let repo: ArtistRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: ArtistRepo,
          useValue: createArtistRepoMock(),
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    repo = module.get<ArtistRepo>(ArtistRepo);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created artist', async () => {
      const dto = ArtistFixtures.createDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(repo, 'create').mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of artists', async () => {
      const expected = ArtistFixtures.array();
      jest.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no artists are found', async () => {
      const expected = [];
      jest.spyOn(repo, 'findAll').mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an artist', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(repo, 'findById').mockResolvedValue(expected);

      const result = await service.findById(expected.id);

      expect(repo.findById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(expected);
      expect(result).toBeInstanceOf(Artist);
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(repo, 'findById')
        .mockRejectedValue(new RpcException('Artist not found'));

      const result = service.findById('non-existent-id');

      expect(repo.findById).toHaveBeenCalledWith('non-existent-id');
      await expect(result).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should return the updated artist', async () => {
      const dto = ArtistFixtures.updateDto();
      const expected = ArtistFixtures.entity();
      jest.spyOn(repo, 'update').mockResolvedValue(expected);

      const result = await service.update(expected.id, dto);

      expect(repo.update).toHaveBeenCalledWith(expected.id, dto);
      expect(result).toEqual(expected);
    });

    it('should throw an error if the artist is not found', async () => {
      const dto = ArtistFixtures.updateDto();
      jest
        .spyOn(repo, 'update')
        .mockRejectedValue(new RpcException('Artist not found'));

      const result = service.update('non-existent-id', dto);

      await expect(result).rejects.toThrow(RpcException);
      expect(repo.update).toHaveBeenCalledWith('non-existent-id', dto);
    });
  });

  describe('delete', () => {
    it('should return undefined on success', async () => {
      const expected = ArtistFixtures.entity();
      jest.spyOn(repo, 'delete').mockResolvedValue(true);

      const result = await service.delete(expected.id);

      expect(repo.delete).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(true);
    });

    it('should throw an error if the artist is not found', async () => {
      jest
        .spyOn(repo, 'delete')
        .mockRejectedValue(new RpcException('Artist not found'));

      const result = service.delete('non-existent-id');

      await expect(result).rejects.toThrow(RpcException);
      expect(repo.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
