import { IsUUID } from 'class-validator';

export class DeleteTrackDto {
  @IsUUID()
  id: string;
}
