import { Module } from '@nestjs/common';
import { HistoryModule } from 'src/history/history.module';
import { TaskModule } from 'src/task/task.module';
import { KeywordController } from './keyword.controller';
import { KeywordService } from './keyword.service';

@Module({
  imports: [HistoryModule, TaskModule],
  controllers: [KeywordController],
  providers: [KeywordService],
})
export class KeywordModule {}
