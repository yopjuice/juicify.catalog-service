/* @name AlbumCreate */
INSERT INTO albums (
    title, release_date, cover_url, type, artist_id, created_at, updated_at
) VALUES (:title!, :release_date, :cover_url, :type!, :artist_id!, NOW(), NOW())
RETURNING *;
