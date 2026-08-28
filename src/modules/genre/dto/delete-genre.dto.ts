import { IsUUID } from 'class-validator';

export class DeleteGenreDto {
  @IsUUID()
  id: string;
}
