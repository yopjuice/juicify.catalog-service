/* @name GenreCreate */
INSERT INTO genres (
    name,  created_at, updated_at
) VALUES (:name,  NOW(), NOW())
RETURNING *;
