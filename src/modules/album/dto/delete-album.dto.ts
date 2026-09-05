import { IsUUID } from 'class-validator';

export class DeleteAlbumDto {
  @IsUUID()
  id: string;
}
