import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';
import { CreateKeywordDto, EditKeywordDto } from './dto';

@Injectable()
export class KeywordService {
  constructor(
    private prismaService: PrismaService,
    private util: UtilService,
  ) {}

  async getKeywords(userId: number) {
    const keywords = await this.prismaService.keyword.findMany({
      where: { userId },
    });

    return keywords.map((keyword) => this.util.exclude(keyword, 'userId'));
  }

  async getKeywordById(userId: number, keywordId: number) {
    const keyword = await this.prismaService.keyword.findFirst({
      where: { id: keywordId, userId },
    });

    return this.util.exclude(keyword, 'userId');
  }

  async createKeyword(userId: number, dto: CreateKeywordDto) {
    const keyword = await this.prismaService.keyword.create({
      data: { userId, ...dto },
    });

    return this.util.exclude(keyword, 'userId');
  }

  async editKeywordById(
    userId: number,
    keywordId: number,
    dto: EditKeywordDto,
  ) {
    const keyword = await this.prismaService.keyword.findUnique({
      where: { id: keywordId },
    });

    if (!keyword || keyword.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const updatedKeyword = await this.prismaService.keyword.update({
      where: { id: keywordId },
      data: dto,
    });

    return this.util.exclude(updatedKeyword, 'userId');
  }

  async deleteKeywordById(userId: number, keywordId: number) {
    const keyword = await this.prismaService.keyword.findUnique({
      where: { id: keywordId },
    });

    if (!keyword || keyword.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    this.prismaService.keyword.delete({
      where: { id: keywordId },
    });
  }
}
