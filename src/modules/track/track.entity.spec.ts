import { Track } from './track.entity';
import { TrackFixtures } from './fixtures/track.fixture';

describe('Track Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = TrackFixtures.props();
      const track = new Track(props);

      expect(track.id).toBe(props.id);
      expect(track.title).toBe(props.title);
      expect(track.duration).toBe(props.duration);
      expect(track.orderNumber).toBe(props.orderNumber);
      expect(track.albumId).toBe(props.albumId);
      expect(track.artistId).toBe(props.artistId);
      expect(track.pathKey).toBe(props.pathKey);
      expect(track.coverUrl).toBe(props.coverUrl);
      expect(track.status).toBe(props.status);
      expect(track.createdAt).toBe(props.createdAt);
      expect(track.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('changetitle()', () => {
    it('should successfully change the title if it is 3 or more characters long', () => {
      const track = new Track(TrackFixtures.props({ title: 'Old title' }));

      track.changeTitle('New title');

      expect(track.title).toBe('New title');
    });

    it('should throw an error if the new title is less than 3 characters long', () => {
      const track = new Track(TrackFixtures.props({ title: 'Valid title' }));

      expect(() => track.changeTitle('Jo')).toThrow(
        'Title must be at least 3 characters long',
      );

      expect(track.title).toBe('Valid title');
    });
  });

});
