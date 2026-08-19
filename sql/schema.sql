-- 1. Создание перечислений (Enums)
CREATE TYPE "AlbumType" AS ENUM ('LP', 'EP', 'Single');
CREATE TYPE "TrackStatus" AS ENUM ('READY', 'PENDING', 'ERROR');

CREATE TABLE "genres" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,


    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "artists" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "albums" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "release_date" TIMESTAMP (3),
    "cover_url" TEXT,
    "type" "AlbumType" NOT NULL,
    "genre_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "albums_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "tracks" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "order_number" INTEGER NOT NULL,
    "album_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "path_key" TEXT,
    "cover_url" TEXT,
    "status" "TrackStatus" NOT NULL DEFAULT 'PENDING',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "_GenreToTrack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToTrack_AB_pkey" PRIMARY KEY ("A", "B"),
    CONSTRAINT "_GenreToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "genres" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GenreToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "tracks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE TRIGGER update_genres_modtime BEFORE UPDATE ON "genres" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_modtime BEFORE UPDATE ON "artists" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_albums_modtime BEFORE UPDATE ON "albums" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_modtime BEFORE UPDATE ON "tracks" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
