import { IsUUID } from 'class-validator';

export class GetGenreDto {
  @IsUUID()
  id: string;
}
