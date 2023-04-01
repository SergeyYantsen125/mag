import { Prisma } from '@prisma/client';
import {returnUserObjects} from "../user/return-user.objects";

export const returnReviewObjects: Prisma.ReviewSelect = {
  user: {
    select: returnUserObjects,
  },
  createdAt: true,
  id: true,
  text: true,
  rating: true,
};
