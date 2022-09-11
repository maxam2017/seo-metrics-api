import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  runTaskEveryHalfADay() {
    return this.runAllTask();
  }

  async runAllTask() {
    const keywords = await this.prisma.keyword.findMany({
      where: { enabled: true },
    });

    console.log(keywords);
  }

  async runUserTask(userId: number, keywordId: number) {
    const keyword = await this.prisma.keyword.findUnique({
      where: { id: keywordId },
    });

    if (!keyword || keyword.userId !== userId || !keyword.enabled) {
      throw new ForbiddenException();
    }

    console.log(keyword);
  }
}
