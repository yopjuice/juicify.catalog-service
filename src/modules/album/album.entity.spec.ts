import { Album, AlbumProps } from './album.entity';
import { AlbumFixtures } from './fixtures/album.fixture';

describe('Album Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = AlbumFixtures.props();
      const album = new Album(props);

      expect(album.id).toBe(props.id);
      expect(album.title).toBe(props.title);
      expect(album.releaseDate).toBe(props.releaseDate);
      expect(album.coverUrl).toBe(props.coverUrl);
      expect(album.type).toBe(props.type);
      expect(album.genreId).toBe(props.genreId);
      expect(album.artistId).toBe(props.artistId);
      expect(album.createdAt).toBe(props.createdAt);
      expect(album.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('changeTitle()', () => {
    it('should successfully change the title if it is 3 or more characters long', () => {
      const album = new Album(AlbumFixtures.props({ title: 'Old title' }));

      album.changeTitle('New title');

      expect(album.title).toBe('New title');
    });

    it('should throw an error if the new title is less than 3 characters long', () => {
      const album = new Album(AlbumFixtures.props({ title: 'Valid title' }));

      expect(() => album.changeTitle('Jo')).toThrow(
        'title must be at least 3 characters long',
      );

      expect(album.title).toBe('Valid title');
    });
  });

});
