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
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateKeywordDto, EditKeywordDto } from './dto';
import { KeywordService } from './keyword.service';

@UseGuards(JwtGuard)
@Controller('keywords')
export class KeywordController {
  constructor(private keywordService: KeywordService) {}

  @Get()
  getKeywords(@GetUser('id') userId: number) {
    return this.keywordService.getKeywords(userId);
  }

  @Get(':id')
  getKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
  ) {
    return this.keywordService.getKeywordById(userId, keywordId);
  }

  @Post()
  createKeyword(@GetUser('id') userId: number, @Body() dto: CreateKeywordDto) {
    return this.keywordService.createKeyword(userId, dto);
  }

  @Put(':id')
  editKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
    @Body() dto: EditKeywordDto,
  ) {
    return this.keywordService.editKeywordById(userId, keywordId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteKeywordById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) keywordId: number,
  ) {
    return this.keywordService.deleteKeywordById(userId, keywordId);
  }
}
