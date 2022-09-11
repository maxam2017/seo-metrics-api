import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { HistoryService } from './history.service';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(private historySerivce: HistoryService) {}

  @Get()
  getHistories(@GetUser('id') userId: number) {
    return this.historySerivce.getHistories(userId);
  }
}
