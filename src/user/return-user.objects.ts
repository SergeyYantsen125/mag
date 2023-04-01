import { Prisma } from '@prisma/client';

export const returnUserObjects: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  phone: true,
  password: false,

};
