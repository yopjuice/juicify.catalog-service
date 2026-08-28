import { GenreServiceClient } from '@juice11-micro/contracts';
import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { GrpcToPromise } from '../../shared/types';

// Wrap gRPC service to make it work with promises and TS
@Injectable()
export class GenreGrpc implements OnModuleInit {
  private readonly logger = new Logger(GenreGrpc.name);
  private rawService: GenreServiceClient;
  
  public client: GrpcToPromise<GenreServiceClient>; 

  constructor(
    @Inject('GENRE_INTERNAL_PROXY') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // Original gRPC service from Nest
    this.rawService = this.grpcClient.getService<any>('GenreService');

    // Create proxy, which will call original methods
    this.client = new Proxy(this.rawService, {
      get: (target, propKey, receiver) => {
        // check if method exists in original service
        if (typeof target[propKey] === 'function') {
          return async (...args: any[]) => {
            const methodName = String(propKey);
            this.logger.log(`[gRPC Outgoing] Call: ${methodName}`, { args });

            try {
              // Call original method
              const result = target[propKey].apply(target, args);

              // If it's Observable (standard for NestJS gRPC), wrap in Promise
              if (result instanceof Observable) {
                return await lastValueFrom(result);
              }

              return result;
            } catch (error: any) {
              this.logger.error(`[gRPC Outgoing Error] ${methodName} failed: ${error.message}`);
              throw error;
            }
          };
        }
        
        return Reflect.get(target, propKey, receiver);
      },
    }) as any;
  }
}
