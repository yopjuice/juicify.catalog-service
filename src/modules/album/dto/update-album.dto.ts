import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsUUID } from 'class-validator';
import type { CreateAlbumInput } from './create-album.dto';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export class UpdateAlbumPayloadDto extends UpdateAlbumDto {
  @IsUUID()
  id: string;
}


export type UpdateAlbumInput = Partial<CreateAlbumInput>;
