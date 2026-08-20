import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { createArtistRepoMock } from './mocks/artist.mock';
import { ArtistRepository } from '../../infrastrusture/artist/artist.repo'

describe('ArtistService', () => {
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        { provide: ArtistRepository, useValue: createArtistRepoMock() },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
