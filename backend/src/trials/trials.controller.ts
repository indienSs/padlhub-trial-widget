import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { QueryTrialsDto } from './dto/query-trials.dto';

@Controller('api/trials')
export class TrialsController {
  constructor(private readonly trials: TrialsService) {}

  @Get()
  list(@Query() query: QueryTrialsDto) {
    return this.trials.findAll(query);
  }

  @Get(':id')
  async details(@Param('id') id: string) {
    try {
      return await this.trials.findOne(id);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new NotFoundException('Тренировка не найдена');
    }
  }
}
