import { Global, Module } from "@nestjs/common";
import { MyConfigService } from "./config.service";
import { ConfigModule } from "@nestjs/config";
import { grpcEnv} from "./env/grpc.env";
import { databaseEnv } from "./env/database.env";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ 
     isGlobal: true,
     load: [
       grpcEnv,
       databaseEnv,
     ],
     }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule { };
