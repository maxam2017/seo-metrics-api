import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prismaService: PrismaService) {}

  getHistories(userId: number) {
    return this.prismaService.history.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });
  }

  getHistoriesByKeywordId(userId: number, keywordId: number) {
    return this.prismaService.history.findMany({
      where: { userId, keywordId },
    });
  }
}
