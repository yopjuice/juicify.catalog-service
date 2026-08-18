import {  IsString } from "class-validator";

export class DatabaseValidator {
	@IsString()
	DATABASE_URL: string;
}
