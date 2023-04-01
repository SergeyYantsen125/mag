import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnCategoryObjects } from '../category/return-category';
import { Category, Review } from '@prisma/client';
import { CategoryDto } from '../category/dto/category.dto';
import slugify from 'slugify';
import { returnReviewObjects } from './return-review';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      select: returnReviewObjects,
    });
  }

  async create(
    userId: number,
    dto: ReviewDto,
    productId: number,
  ): Promise<Review> {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: { id: productId },
        },
        user: { connect: { id: userId } },
      },
    });
  }

  async getAverageValueByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: {
          productId: productId,
        },
        _avg: {
          rating: true,
        },
      })
      .then((result) => result._avg);
  }
}
