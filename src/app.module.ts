import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { KeywordModule } from './keyword/keyword.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { HistoryModule } from './history/history.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    AuthModule,
    UserModule,
    KeywordModule,
    PrismaModule,
    UtilModule,
    ScheduleModule.forRoot(),
    HistoryModule,
    ServeStaticModule.forRoot({
      serveRoot: '/media',
      rootPath: join(__dirname, '..', 'media'),
    }),
  ],
})
export class AppModule {}
