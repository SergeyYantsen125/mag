import { Prisma } from '@prisma/client';
import { returnReviewObjects } from '../review/return-review';
import { returnCategoryObjects } from '../category/return-category';

export const productReturnObject: Prisma.ProductSelect = {
  image: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true,
  category: { select: { name: true } },
};

export const productReturnObjectFulltest: Prisma.ProductSelect = {
  ...productReturnObject,
  reviews: { select: returnReviewObjects },
  category: { select: returnCategoryObjects },
};
