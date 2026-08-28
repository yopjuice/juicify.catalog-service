import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenrePayloadDto } from './dto/update-genre.dto';
import { DeleteGenreDto } from './dto/delete-genre.dto';
import { GetGenreDto } from './dto/get-genre.dto';
import { Logger } from '@nestjs/common';

@Controller()
export class GenreController {
  private readonly logger = new Logger(GenreController.name);

  constructor(private readonly genreService: GenreService) {}

  @GrpcMethod('GenreService', 'ListGenres')
  async findAll() {
    const res = await this.genreService.findAll();
    this.logger.log(res);

    return { genres: res };
  }

  @GrpcMethod('GenreService', 'CreateGenre')
  async create(@Payload() payload: CreateGenreDto) {
    const res = await this.genreService.create(payload);
    return { genre: res };
  }

  @GrpcMethod('GenreService', 'GetGenre')
  async findOne(@Payload() payload: GetGenreDto) {
    const res = await this.genreService.findById(payload.id);
    this.logger.log(res);
    return { genre: res };
  }

  @GrpcMethod('GenreService', 'UpdateGenre')
  async update(@Payload() payload: UpdateGenrePayloadDto) {
    const { id, ...dto } = payload;
    const res = await this.genreService.update(id, dto);
    this.logger.log(res);
    return { genre: res };
  }

  @GrpcMethod('GenreService', 'DeleteGenre')
  async delete(@Payload() payload: DeleteGenreDto) {
    const res = await this.genreService.delete(payload.id);
    this.logger.log(res);
    return undefined;
  }
}
