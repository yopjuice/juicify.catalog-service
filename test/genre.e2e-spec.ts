import { Test, TestingModule } from '@nestjs/testing';
import { GrpcValidationPipe } from '../src/infrastrusture/grpc/grpc.validation-pipe';
import { GlobalGrpcExceptionFilter } from '../src/infrastrusture/grpc/grpc.filter';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module';
import { GenreServiceClient } from '@juice11-micro/contracts';
import {
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastrusture/grpc/gprc.options';
import { MyConfigService } from '../src/config/config.service';
import { DatabaseProvider } from '../src/infrastrusture/db/db.provider';
import { GenreRepo } from '../src/infrastrusture/genre/genre.repo';
import { GenreFixtures } from '../src/modules/genre/fixtures/genre.fixture';
import { GrpcToPromise } from '../src/shared/types';
import { GenreGrpc } from '../src/infrastrusture/genre/genre.client';

// TODO: add separate database for testing
describe('Genre gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: GenreGrpc;
  let client: GrpcToPromise<GenreServiceClient>;
  let db: DatabaseProvider;
  let repo: GenreRepo;

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

    wrapper = moduleFixture.get<GenreGrpc>(GenreGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<GenreRepo>(GenreRepo);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE genres CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create genre via gRPC', async () => {
    const dto = GenreFixtures.createDto();
    const response = await client.createGenre(dto);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('genre');
    expect(response.genre).toHaveProperty('id');
  });

  it('should get genre by id via gRPC', async () => {
    const dto = GenreFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await client.getGenre({ id });

    expect(response).toBeDefined();
    expect(response).toHaveProperty('genre');
  });

  it('should get all genres via gRPC', async () => {
    const dto = GenreFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await client.listGenres({});

    expect(response).toBeDefined();
    expect(response).toHaveProperty('genres');
    expect(response.genres).toHaveLength(1);
    expect(response.genres[0]).toHaveProperty('id');
    expect(response.genres[0].id).toBe(id);
  });

  it('should update genre via gRPC', async () => {
    const dto = GenreFixtures.createDto();
    const { id } = await repo.create(dto);
    const updatedDto = GenreFixtures.updateDto();
    const response = await client.updateGenre({ id, ...updatedDto });


    expect(response).toBeDefined();
    expect(response).toHaveProperty('genre');
    expect(response.genre).toHaveProperty('id');
    expect(response.genre?.id).toBe(id);
  });

  it('should delete genre via gRPC', async () => {
    const dto = GenreFixtures.createDto();
    const { id } = await repo.create(dto);
    const response = await client.deleteGenre({ id });

    expect(response).toBeDefined();
    expect(response).toEqual({});
  });

  describe('NOT_FOUND errors', () => {
    it.each([
      {
        method: 'getGenre',
        call: () => client.getGenre({ id: GenreFixtures.uuid() }),
      },
      {
        method: 'deleteGenre',
        call: () => client.deleteGenre({ id: GenreFixtures.uuid() }),
      },
      {
        method: 'updateGenre',
        call: () =>
          client.updateGenre({
            id: GenreFixtures.uuid(),
            ...GenreFixtures.updateDto(),
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
        method: 'getGenre',
        field: 'id',
        call: () => client.getGenre({ id: 'invalid-uuid-format' }),
      },
      {
        method: 'updateGenre',
        field: 'name',
        call: () =>
          client.updateGenre({ id: GenreFixtures.uuid(), name: '' }),
      },
      {
        method: 'deleteGenre',
        field: 'id',
        call: () => client.deleteGenre({ id: 'invalid-uuid-format' }),
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
