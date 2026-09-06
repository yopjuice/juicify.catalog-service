/* @name TrackDelete */
DELETE FROM tracks WHERE id = :id!
RETURNING *;
