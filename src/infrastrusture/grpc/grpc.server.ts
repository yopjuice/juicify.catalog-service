import { INestApplication } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { grpcPackages, grpcProtoPaths, grpcLoader } from "./gprc.options";
import { MyConfigService } from "../../config/config.service";

export function createGrpcServer(
	app: INestApplication,
	config: MyConfigService
) {

	const host = config.get('grpc.host')
	const port = config.get('grpc.port')

	const url = `${host}:${port}`
	
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: grpcPackages,
			protoPath: grpcProtoPaths,
			url,
			loader: grpcLoader
		}
	})
}
