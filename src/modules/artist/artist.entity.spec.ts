import { Artist, ArtistProps } from './artist.entity';
import { ArtistFixtures } from './fixtures/artist.fixture';

describe('Artist Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = ArtistFixtures.props();
      const artist = new Artist(props);

      expect(artist.id).toBe(props.id);
      expect(artist.name).toBe(props.name);
      expect(artist.biography).toBe(props.biography);
      expect(artist.isVerified).toBe(false);
      expect(artist.avatarUrl).toBe(props.avatarUrl);
      expect(artist.createdAt).toBe(props.createdAt);
      expect(artist.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('changeName()', () => {
    it('should successfully change the name if it is 3 or more characters long', () => {
      const artist = new Artist(ArtistFixtures.props({ name: 'Old Name' }));

      artist.changeName('New Name');

      expect(artist.name).toBe('New Name');
    });

    it('should throw an error if the new name is less than 3 characters long', () => {
      const artist = new Artist(ArtistFixtures.props({ name: 'Valid Name' }));

      expect(() => artist.changeName('Jo')).toThrow(
        'Name must be at least 3 characters long',
      );

      expect(artist.name).toBe('Valid Name');
    });
  });

  describe('verify()', () => {
    it('should change isVerified to true if it was false', () => {
      const artist = new Artist(ArtistFixtures.props({ isVerified: false }));

      artist.verify();

      expect(artist.isVerified).toBe(true);
    });

    it('should do nothing and remain true if artist is already verified', () => {
      const artist = new Artist(ArtistFixtures.props({ isVerified: true }));

      artist.verify();

      expect(artist.isVerified).toBe(true);
    });
  });
});
