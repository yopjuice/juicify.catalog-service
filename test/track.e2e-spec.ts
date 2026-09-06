import { Test, TestingModule } from '@nestjs/testing';
import { GrpcValidationPipe } from '../src/infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from '../src/infrastrusture/grpc/grpc.filter';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module';
import { TrackServiceClient } from '@juice11-micro/contracts';
import {
    grpcLoader,
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastrusture/grpc/gprc.options';
import { MyConfigService } from '../src/config/config.service';
import { DatabaseProvider } from '../src/infrastrusture/db/db.provider';
import { TrackRepo } from '../src/infrastrusture/track/track.repo';
import { TrackFixtures } from '../src/modules/track/fixtures/track.fixture';
import { GrpcToPromise } from '../src/shared/types';
import { TrackGrpc } from '../src/infrastrusture/track/track.client';
import { ArtistFixtures } from '../src/modules/artist/fixtures/artist.fixture';
import { ArtistService } from '../src/modules/artist/artist.service';
import getFreePort from 'get-port';

// TODO: add separate database for testing
describe('Track gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: TrackGrpc;
  let client: GrpcToPromise<TrackServiceClient>;
  let db: DatabaseProvider;
  let repo: TrackRepo;
  let artistId: string;

  beforeAll(async () => {
    
    // use any free port for testing
    const testPort = await getFreePort();
    process.env.GRPC_PORT = testPort.toString();


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
        loader: grpcLoader,
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(protoOptions);
    app.useGlobalPipes(new GrpcValidationPipe());
    app.useGlobalFilters(new GlobalGrpcExceptionFilter());
    await app.listen();

    wrapper = moduleFixture.get<TrackGrpc>(TrackGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<TrackRepo>(TrackRepo);

    // Crete artist to use valid artist id in track
    const artistDto = ArtistFixtures.createDto();
    const artistService = moduleFixture.get<ArtistService>(ArtistService);
    const artist = await artistService.create(artistDto);
    artistId = artist.id;
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE tracks CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create track via gRPC', async () => {
    const dto = TrackFixtures.createDto({artistId});
    const response = await client.createTrack(dto as any);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('track');
    expect(response.track).toHaveProperty('id');
  });

  it('should get track by id via gRPC', async () => {
    const dto = TrackFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.getTrack({ id });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('track');
  });

  it('should get all tracks via gRPC', async () => {
    const dto = TrackFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.listTracks({});

    expect(response).toBeDefined();
    expect(response).toHaveProperty('tracks');
    expect(response.tracks).toHaveLength(1);
    expect(response.tracks[0]).toHaveProperty('id');
    expect(response.tracks[0].id).toBe(id);
  });

  it('should update track via gRPC', async () => {
    const dto = TrackFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const updatedDto = TrackFixtures.updateDto();
    const response = await client.updateTrack({ id, ...updatedDto as any });


    expect(response).toBeDefined();
    expect(response).toHaveProperty('track');
    expect(response.track).toHaveProperty('id');
    expect(response.track?.id).toBe(id);
  });

  it('should delete track via gRPC', async () => {
    const dto = TrackFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.deleteTrack({ id });

    expect(response).toBeDefined();
    expect(response).toEqual({});
  });

  describe('NOT_FOUND errors', () => {
    it.each([
      {
        method: 'getTrack',
        call: () => client.getTrack({ id: TrackFixtures.uuid() }),
      },
      {
        method: 'deleteTrack',
        call: () => client.deleteTrack({ id: TrackFixtures.uuid() }),
      },
      {
        method: 'updateTrack',
        call: () =>
          client.updateTrack({
            id: TrackFixtures.uuid(),
            ...TrackFixtures.updateDto() as any,
          }),
      },
    ])(
      'should return gRPC NOT_FOUND error when $method target does not exist',
      async ({ call }) => {
        await expect(call()).rejects.toMatchObject({
          code: 5,
          details: expect.stringContaining('not found'),
        });
      },
    );
  });

  describe('Validation errors', () => {
    it.each([
      {
        method: 'getTrack',
        field: 'id',
        call: () => client.getTrack({ id: 'invalid-uuid-format' }),
      },
      {
        method: 'updateTrack',
        field: 'title',
        call: () =>
          client.updateTrack({ id: TrackFixtures.uuid(), title: '' }),
      },
      {
        method: 'deleteTrack',
        field: 'id',
        call: () => client.deleteTrack({ id: 'invalid-uuid-format' }),
      },
    ])(
      'should return gRPC INVALID_ARGUMENT error when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).rejects.toMatchObject({
          code: 13,
          details: expect.stringContaining(field),
        });
      },
    );
  });
});
