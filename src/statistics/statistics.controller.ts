import { Body, Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ReviewDto } from '../review/dto/review.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get('/')
  async getStatics(@CurrentUser('id') userId: number) {
    return this.statisticsService.getMain(userId);
  }
}
