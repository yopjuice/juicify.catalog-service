import { Test, TestingModule } from '@nestjs/testing';
import { GrpcValidationPipe } from '../src/infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from '../src/infrastrusture/grpc/grpc.filter';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module';
import { AlbumServiceClient } from '@juice11-micro/contracts';
import {
    grpcLoader,
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastrusture/grpc/gprc.options';
import { MyConfigService } from '../src/config/config.service';
import { DatabaseProvider } from '../src/infrastrusture/db/db.provider';
import { AlbumRepo } from '../src/infrastrusture/album/album.repo';
import { AlbumFixtures } from '../src/modules/album/fixtures/album.fixture';
import { GrpcToPromise } from '../src/shared/types';
import { AlbumGrpc } from '../src/infrastrusture/album/album.client';
import { ArtistFixtures } from '../src/modules/artist/fixtures/artist.fixture';
import { ArtistService } from '../src/modules/artist/artist.service';
import getFreePort from 'get-port';

// TODO: add separate database for testing
describe('Album gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: AlbumGrpc;
  let client: GrpcToPromise<AlbumServiceClient>;
  let db: DatabaseProvider;
  let repo: AlbumRepo;
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

    wrapper = moduleFixture.get<AlbumGrpc>(AlbumGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<AlbumRepo>(AlbumRepo);

    // Crete artist to use valid artist id in album
    const artistDto = ArtistFixtures.createDto();
    const artistService = moduleFixture.get<ArtistService>(ArtistService);
    const artist = await artistService.create(artistDto);
    artistId = artist.id;
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE albums CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create album via gRPC', async () => {
    const dto = AlbumFixtures.createDto({artistId});
    const response = await client.createAlbum(dto as any);

    expect(response).toBeDefined();
    // expect(response).toHaveProperty('album');
    // expect(response.album).toHaveProperty('id');
  });

  it('should get album by id via gRPC', async () => {
    const dto = AlbumFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.getAlbum({ id });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('album');
  });

  it('should get all albums via gRPC', async () => {
    const dto = AlbumFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.listAlbums({});

    expect(response).toBeDefined();
    expect(response).toHaveProperty('albums');
    expect(response.albums).toHaveLength(1);
    expect(response.albums[0]).toHaveProperty('id');
    expect(response.albums[0].id).toBe(id);
  });

  it('should update album via gRPC', async () => {
    const dto = AlbumFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const updatedDto = AlbumFixtures.updateDto();
    const response = await client.updateAlbum({ id, ...updatedDto as any });


    expect(response).toBeDefined();
    expect(response).toHaveProperty('album');
    expect(response.album).toHaveProperty('id');
    expect(response.album?.id).toBe(id);
  });

  it('should delete album via gRPC', async () => {
    const dto = AlbumFixtures.createDto({artistId});
    const { id } = await repo.create(dto as any);
    const response = await client.deleteAlbum({ id });

    expect(response).toBeDefined();
    expect(response).toEqual({});
  });

  describe('NOT_FOUND errors', () => {
    it.each([
      {
        method: 'getAlbum',
        call: () => client.getAlbum({ id: AlbumFixtures.uuid() }),
      },
      {
        method: 'deleteAlbum',
        call: () => client.deleteAlbum({ id: AlbumFixtures.uuid() }),
      },
      {
        method: 'updateAlbum',
        call: () =>
          client.updateAlbum({
            id: AlbumFixtures.uuid(),
            ...AlbumFixtures.updateDto() as any,
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
        method: 'getAlbum',
        field: 'id',
        call: () => client.getAlbum({ id: 'invalid-uuid-format' }),
      },
      {
        method: 'updateAlbum',
        field: 'title',
        call: () =>
          client.updateAlbum({ id: AlbumFixtures.uuid(), title: '' }),
      },
      {
        method: 'deleteAlbum',
        field: 'id',
        call: () => client.deleteAlbum({ id: 'invalid-uuid-format' }),
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
