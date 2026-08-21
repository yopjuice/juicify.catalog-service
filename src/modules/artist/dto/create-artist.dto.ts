import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
