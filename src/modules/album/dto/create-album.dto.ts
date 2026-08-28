import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
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
