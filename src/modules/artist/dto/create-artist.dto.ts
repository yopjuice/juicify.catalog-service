import { IsOptional, IsString } from "class-validator"

export class CreateArtistDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	biography?: string

	@IsString()
	@IsOptional()
	isVerified?: boolean

	@IsString()
	@IsOptional()
	avatar_url?: string
}
