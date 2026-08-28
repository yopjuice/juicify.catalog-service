/* @name GenreDelete */
DELETE FROM genres WHERE id = :id
RETURNING *;
