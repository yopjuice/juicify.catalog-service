import { ArtistRepository } from '../../src/infrastrusture/artist/artist.repo';
import { ArtistService } from '../../src/modules/artist/artist.service';

export const createArtistServiceMock = (): Record<keyof ArtistService, jest.Mock> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});


export const createArtistRepoMock = (): Record<keyof ArtistRepository, jest.Mock> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
})
