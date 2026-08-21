import { Test, TestingModule } from '@nestjs/testing';
import { GrpcValidationPipe } from '../src/infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from '../src/infrastrusture/grpc/grpc.filter';
import { INestMicroservice } from '@nestjs/common';
import { Transport, ClientGrpcProxy } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module';
import { lastValueFrom } from 'rxjs';
import { ArtistServiceClient } from '@juice11-micro/contracts';
import { grpcPackages, grpcProtoPaths } from '../src/infrastrusture/grpc/gprc.options';
import { MyConfigService } from '../src/config/config.service';
import { DatabaseProvider } from '../src/infrastrusture/db/db.provider';
import { ArtistRepo } from '../src/infrastrusture/artist/artist.repo';
import { ArtistFixtures } from '../src/modules/artist/fixtures/artist.fixture';

// TODO: add separate database for testing
describe('Artist gRPC (e2e)', () => {
  let app: INestMicroservice;
  let client: ArtistServiceClient;
  let db: DatabaseProvider;
  let repo: ArtistRepo;

  beforeAll(async () => {
    // Create testing module with all dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const config = moduleFixture.get<MyConfigService>(MyConfigService);
    const port = config.get('grpc.port');

    const protoOptions = {
      transport: Transport.GRPC as const,
      options: {
        url: `localhost:${port}`,
        package: grpcPackages,
        protoPath: grpcProtoPaths,
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(protoOptions);
    app.useGlobalPipes(new GrpcValidationPipe());
    app.useGlobalFilters(new GlobalGrpcExceptionFilter());
    await app.listen();

    // create gRPC client proxy for sending grpc requests
    const grpcClientProxy = new ClientGrpcProxy(protoOptions.options);
    client = grpcClientProxy.getService<ArtistServiceClient>('ArtistService');

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<ArtistRepo>(ArtistRepo);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE artists CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create artist via gRPC', async () => {
    const dto = ArtistFixtures.createDto();
    const response = await lastValueFrom(client.createArtist(dto));

    expect(response).toBeDefined();
    expect(response).toHaveProperty('artist');
    expect(response.artist).toHaveProperty('id');
  });

  it('should get artist by id via gRPC', async () => {
    const dto = ArtistFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await lastValueFrom(client.getArtist({ id }));

    expect(response).toBeDefined();
    expect(response).toHaveProperty('artist');
  });

  it('should get all artists via gRPC', async () => {
    const dto = ArtistFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await lastValueFrom(client.listArtists({}));

    expect(response).toBeDefined();
    expect(response).toHaveProperty('artists');
    expect(response.artists).toHaveLength(1);
    expect(response.artists[0]).toHaveProperty('id');
    expect(response.artists[0].id).toBe(id);
  });

  it('should update artist via gRPC', async () => {
    const dto = ArtistFixtures.createDto();
    const { id } = await repo.create(dto);
    const updatedDto = ArtistFixtures.updateDto();
    const response = await lastValueFrom(client.updateArtist({ id, ...updatedDto }));

    expect(response).toBeDefined();
    expect(response).toHaveProperty('artist');
    expect(response.artist).toHaveProperty('id');
    expect(response.artist?.id).toBe(id);
  });

  it('should delete artist via gRPC', async () => {
    const dto = ArtistFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await lastValueFrom(client.deleteArtist({ id, }));

    expect(response).toBeDefined();
    expect(response).toEqual({});
  });

  describe('NOT_FOUND errors', () => {
    it.each([
      {
        method: 'getArtist',
        call: () => client.getArtist({ id: ArtistFixtures.uuid() })
      },
      {
        method: 'deleteArtist',
        call: () => client.deleteArtist({ id: ArtistFixtures.uuid() })
      },
      {
        method: 'updateArtist',
        call: () => client.updateArtist({ id: ArtistFixtures.uuid(), ...ArtistFixtures.updateDto() })
      },
    ])('should return gRPC NOT_FOUND error when $method target does not exist', async ({ call }) => {
      await expect(lastValueFrom(call())).rejects.toMatchObject({
        code: 5,
        details: expect.stringContaining('not found'),
      });
    });
  });

  describe('Validation errors', () => {
    it.each([
      {
        method: 'getArtist',
        field: 'id',
        call: () => client.getArtist({ id: 'invalid-uuid-format' })
      },
      {
        method: 'updateArtist',
        field: 'name',
        call: () => client.updateArtist({ id: ArtistFixtures.uuid(), name: '' })
      },
      {
        method: 'deleteArtist',
        field: 'id',
        call: () => client.deleteArtist({ id: 'invalid-uuid-format' })
      }
    ])('should return gRPC INVALID_ARGUMENT error when $method params are invalid', async ({ call, field }) => {
      await expect(lastValueFrom(call())).rejects.toMatchObject({
        code: 13,
        details: expect.stringContaining(field),
      });
    });
  });

});
