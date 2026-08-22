/* @name ArtistCreate */
INSERT INTO artists (
    name, biography, avatar_url, is_verified, created_at, updated_at
) VALUES (:name, :biography, :avatar_url, :is_verified, NOW(), NOW())
RETURNING *;
