import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TrackStatus } from '../track.entity';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderNumber?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  albumId?: string;

  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pathKey?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  coverUrl?: string;

  @IsOptional()
  @IsEnum(TrackStatus)
  status?: TrackStatus;

}
