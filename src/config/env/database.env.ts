import { registerAs } from '@nestjs/config'
import { validateEnv } from '../../shared/utils/validate-env'
import type { DatabaseConfig } from '../interfaces/database.interface'
import { DatabaseValidator } from '../validators/database.validator'

// Loader for database env
export const databaseEnv = registerAs<DatabaseConfig>('database', () => {
  try {
    validateEnv(process.env, DatabaseValidator)
  } catch (e: any) {
    console.error(e.message ?? 'Env validation error');
    process.exit(1);
  }
	return {
		url: process.env.DATABASE_URL
	}
})
