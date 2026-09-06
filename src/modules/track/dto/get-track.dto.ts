import { IsUUID } from 'class-validator';

export class GetTrackDto {
  @IsUUID()
  id: string;
}
