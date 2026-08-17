import { registerAs } from '@nestjs/config'
import { validateEnv } from '../../shared/utils/validate-env'
import type { GrpcConfig } from '../interfaces/grpc.interface'
import { GrpcValidator } from '../validators/grpc.validator'

// Loader for grpc env
export const grpcEnv = registerAs<GrpcConfig>('grpc', () => {
	validateEnv(process.env, GrpcValidator)
	return {
		host: process.env.GRPC_HOST,
		port: parseInt(process.env.GRPC_PORT!)
	}
})
