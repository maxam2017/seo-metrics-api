import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { HistoryService } from 'src/history/history.service';
import { CreateKeywordDto, EditKeywordDto } from './dto';
import { KeywordService } from './keyword.service';

@ApiBearerAuth()
@ApiTags('Keyword')
@UseGuards(JwtGuard)
@Controller('keywords')
export class KeywordController {
  constructor(
    private keywordService: KeywordService,
    private historyService: HistoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get keywords' })
  getKeywords(@GetUser('id') userId: number) {
    return this.keywordService.getKeywords(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get keyword by id' })
  getKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
  ) {
    return this.keywordService.getKeywordById(userId, keywordId);
  }

  @Post()
  @ApiOperation({ summary: 'Create keyword' })
  createKeyword(@GetUser('id') userId: number, @Body() dto: CreateKeywordDto) {
    return this.keywordService.createKeyword(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit keyword by id' })
  editKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
    @Body() dto: EditKeywordDto,
  ) {
    return this.keywordService.editKeywordById(userId, keywordId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete keyword by id' })
  deleteKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
  ) {
    return this.keywordService.deleteKeywordById(userId, keywordId);
  }

  @ApiOperation({ summary: 'Get histories by keyword id' })
  @Get(':id/histories')
  getHistoriesByKeywordId(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
  ) {
    return this.historyService.getHistoriesByKeywordId(userId, keywordId);
  }
}
