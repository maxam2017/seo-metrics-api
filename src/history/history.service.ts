import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class HistoryService {
  constructor(
    private prismaService: PrismaService,
    private util: UtilService,
  ) {}

  getHistories(userId: number) {
    return this.prismaService.history.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });
  }

  async getHistoriesByKeywordId(userId: number, keywordId: number) {
    const histories = await this.prismaService.history.findMany({
      where: { userId, keywordId },
      include: { search_results: true },
      orderBy: { updatedAt: 'desc' },
    });

    return histories.map((history) =>
      this.util.exclude(history, 'userId', 'keywordId'),
    );
  }
}
