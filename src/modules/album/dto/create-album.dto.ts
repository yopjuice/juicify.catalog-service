import { Type } from 'class-transformer';
import { AlbumType } from '../album.entity';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  coverUrl?: string;
 
  @IsEnum(AlbumType)
  type: AlbumType;

  @IsString()
  @IsNotEmpty()
  artistId: string;
}

export type CreateAlbumInput = Omit<CreateAlbumDto, 'releaseDate'> & {
  releaseDate?: string;
};
