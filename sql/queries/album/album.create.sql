/* @name AlbumCreate */
INSERT INTO albums (
    title, release_date, cover_url, type, genre_id, artist_id, created_at, updated_at
) VALUES (:name, :release_date, :cover_url, :type, :genre_id, :artist_id, NOW(), NOW())
RETURNING *;
