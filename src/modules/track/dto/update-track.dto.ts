import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { IsUUID } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}

export class UpdateTrackPayloadDto extends UpdateTrackDto {
  @IsUUID()
  id: string;
}
