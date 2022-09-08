import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the user into the db
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential has been taken');
        }
      }

      throw error;
    }
  }

  async login(dto: AuthDto) {
    // find the user by the email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // throw exception if user doesn't exist
    if (!user) {
      throw new ForbiddenException('Credential is incorrect');
    }

    // compare password
    // throw error if password is wrong
    const isPasswordMatched = await argon.verify(user.hash, dto.password);
    if (!isPasswordMatched) {
      throw new ForbiddenException('Credential is incorrect');
    }

    delete user.hash;

    return user;
  }
}
