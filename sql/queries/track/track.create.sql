/* @name TrackCreate */
INSERT INTO tracks (
    title, duration, order_number, album_id, artist_id, path_key, cover_url, status, created_at, updated_at
) VALUES (:title!, :duration!, :orderNumber, :albumId, :artistId!, :pathKey, :coverUrl, :status, NOW(), NOW())
RETURNING *;
