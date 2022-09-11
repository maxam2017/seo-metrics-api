import { Module } from '@nestjs/common';
import { HistoryModule } from 'src/history/history.module';
import { KeywordController } from './keyword.controller';
import { KeywordService } from './keyword.service';

@Module({
  imports: [HistoryModule],
  controllers: [KeywordController],
  providers: [KeywordService],
})
export class KeywordModule {}
