import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { returnUserObjects } from '../user/return-user.objects';
import { PrismaService } from '../prisma.service';
import { returnCategoryObjects } from './return-category';
import { UserDto } from '../user/dto/user.dto';
import { hash } from 'argon2';
import { CategoryDto } from './dto/category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      select: returnCategoryObjects,
    });
    if (!category) throw new BadRequestException("Category don't find");
    return category;
  }
  async updateCategory(id: number, categoryDto: CategoryDto) {
    return this.prisma.category.update({
      where: { id: id },
      data: {
        name: categoryDto.name,
        slug: slugify(categoryDto.name),
      },
    });
  }
  //Здесь остановился
  async deleteCategory(id: number) {
    return this.prisma.category.update({
      where: { id: id },
      data: {
        name: categoryDto.name,
        slug: slugify(categoryDto.name),
      },
    });
  }
}
