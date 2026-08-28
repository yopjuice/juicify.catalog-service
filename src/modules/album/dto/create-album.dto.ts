import { AlbumType } from '../album.entity';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;
 
  @IsEnum(AlbumType)
  type: AlbumType;

  @IsString()
  @IsNotEmpty()
  genreId: string;

  @IsString()
  @IsNotEmpty()
  artistId: string;
}
