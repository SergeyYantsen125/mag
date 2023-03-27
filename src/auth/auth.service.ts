import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/RefreshTokenDto';
import { verify } from 'argon2';

const argon2 = require('argon2');

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (oldUser) throw new BadRequestException('User already exist');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number('+7 (###) ###-##-##'),
        password: await argon2.hash(dto.password),
      },
    });
    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewToken(refreshoken: RefreshTokenDto) {
    const result = await this.jwt.verify(refreshoken.refreshToken);
    if (!result)
      throw new UnauthorizedException({ message: 'Invalid refresh token' });

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto);
    const tokens = await this.issueTokens(user.id);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException("User don't find");
    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');
    return user;
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
