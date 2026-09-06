import { IsUUID } from 'class-validator';

export class GetAlbumDto {
  @IsUUID()
  id: string;
}
