import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { returnUserObjects } from './return-user.objects';
import { UserDto } from './dto/user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number, selectObjects: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        ...returnUserObjects,
        favorite: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            slug: true,
          },
        },
        orders: true,
        ...selectObjects,
      },
    });
    if (!user) throw new BadRequestException("User don't find");
    return user;
  }

  async updateProfile(id: number, userDto: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException('Email already in use');

    const user = await this.byId(id);
    if (!user) throw new BadRequestException("User don't find");

    return this.prisma.user.update({
      where: { id: id },
      data: {
        email: userDto.email,
        name: userDto.name,
        avatarPath: userDto.avatarPath,
        phone: userDto.phone,
        password: userDto.password
          ? await hash(userDto.password)
          : user.password,
      },
    });
  }

  async toggleFavorite(id: number, productId: number) {
    const user = await this.byId(id);
    if (!user) throw new BadRequestException("User don't find");

    const isExist = user.favorite.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: { id: id },
      data: {
        favorite: {
          [isExist ? 'disconnect' : 'connect']: { id: productId },
        },
      },
    });
    return { message: 'Succes' };
  }
}
