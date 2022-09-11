import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { KeywordModule } from './keyword/keyword.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    KeywordModule,
    PrismaModule,
    UtilModule,
    ScheduleModule.forRoot(),
    HistoryModule,
  ],
})
export class AppModule {}
