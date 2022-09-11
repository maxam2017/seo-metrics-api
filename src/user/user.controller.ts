import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  @Get('me')
  @ApiOperation({ summary: 'Get self user info' })
  getMe(@GetUser() user: User) {
    return user;
  }
}
