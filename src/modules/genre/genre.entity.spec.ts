import { Genre } from './genre.entity';
import { GenreFixtures } from './fixtures/genre.fixture';

describe('Genre Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = GenreFixtures.props();
      const genre = new Genre(props);

      expect(genre.id).toBe(props.id);
      expect(genre.name).toBe(props.name);
      expect(genre.createdAt).toBe(props.createdAt);
      expect(genre.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('changeName()', () => {
    it('should successfully change the name if it is 3 or more characters long', () => {
      const genre = new Genre(GenreFixtures.props({ name: 'Old Name' }));

      genre.changeName('New Name');

      expect(genre.name).toBe('New Name');
    });

    it('should throw an error if the new name is less than 3 characters long', () => {
      const genre = new Genre(GenreFixtures.props({ name: 'Valid Name' }));

      expect(() => genre.changeName('Jo')).toThrow(
        'Name must be at least 3 characters long',
      );

      expect(genre.name).toBe('Valid Name');
    });
  });

});
