import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma.service';
import { productReturnObject } from './return-objects';
import { ProductDto } from './dto/product.dto';
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto';
import { PagimationService } from '../pagimation/pagimation.service';
import {returnUserObjects} from "../user/return-user.objects";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private pagination: PagimationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) {
      {
        prismaSort.push({ price: 'asc' });
      }
    } else if (sort === EnumProductSort.HIGH_PRICE) {
      {
        prismaSort.push({ price: 'desc' });
      }
    } else if (sort === EnumProductSort.OLDEST) {
      {
        prismaSort.push({ createdAt: 'asc' });
      }
    } else {
      prismaSort.push({ createdAt: 'desc' });
    }
    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : {};

    const { page, perPage, skip } = this.pagination.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: productReturnObject
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
      page: page,
      perPage: perPage,
      skip: skip
    };
  }

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      select: productReturnObject,
    });
    if (!product) throw new BadRequestException("Product don't find");
    return product;
  }

  async byslug(slug: string) {
    const product = await this.prisma.product.findMany({
      where: { slug: slug },
      select: productReturnObject,
    });
    if (!product) throw new BadRequestException("Product don't find");
    return product;
  }

  async byCategory(CategorySlug: string) {
    const product = await this.prisma.product.findMany({
      where: { slug: CategorySlug },
      select: productReturnObject,
    });
    if (!product) throw new BadRequestException("Product don't find");
    return product;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct) throw new BadRequestException("Product don't find");

    const product = await this.prisma.product.findMany({
      where: {
        category: { name: currentProduct.category.name },
        NOT: { id: currentProduct.id },
      },
      orderBy: { createdAt: 'desc' },
      select: productReturnObject,
    });

    return product;
  }

  async create() {
    return this.prisma.product
      .create({
        data: {
          description: '',
          name: '',
          price: '0',
          slug: '',
        },
      })
      .then((res) => res.id);
  }

  async update(id: number, dto: ProductDto): Promise<Product> {
    const { name, price, description, image, categoryId } = dto;
    return this.prisma.product.update({
      where: { id: id },
      data: {
        name,
        price,
        description,
        image,
        slug: slugify(name).toLowerCase(),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}
