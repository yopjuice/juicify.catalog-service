import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { IsUUID } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}

export class UpdateGenrePayloadDto extends UpdateGenreDto {
  @IsUUID()
  id: string;
}
