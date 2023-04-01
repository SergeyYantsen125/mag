import { Prisma } from '@prisma/client';

export const returnCategoryObjects: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
};
