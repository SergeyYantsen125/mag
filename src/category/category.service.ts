import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
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

  async findAll() {
    return this.prisma.category.findMany({
      select: returnCategoryObjects
    });
  }

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      select: returnCategoryObjects,
    });
    if (!category) throw new BadRequestException("Category don't find");
    return category;
  }

  async byslug(slug: string) {
    const category = await this.prisma.category.findMany({
      where: { slug: slug },
      select: returnCategoryObjects,
    });
    if (!category) throw new BadRequestException("Category don't find");
    return category;
  }

  async create(): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

  async updateCategory(
    id: number,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id: id },
      data: {
        name: categoryDto.name,
        slug: slugify(categoryDto.name).toLowerCase(),
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id: id },
    });
  }
}
