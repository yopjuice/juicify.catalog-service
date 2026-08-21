import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsUUID } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}

export class UpdateArtistPayloadDto extends UpdateArtistDto {
  @IsUUID()
  id: string;
}
