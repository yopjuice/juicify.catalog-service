import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsUUID } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export class UpdateAlbumPayloadDto extends UpdateAlbumDto {
  @IsUUID()
  id: string;
}
