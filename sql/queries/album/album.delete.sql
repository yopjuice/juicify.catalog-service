/* @name AlbumDelete */
DELETE FROM albums WHERE id = :id
RETURNING *;
