/* @name ArtistDelete */
DELETE FROM artists WHERE id = :id
RETURNING *;
