import { Prisma, PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as querystring from 'querystring';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../src/prisma.service';
import slugify from 'slugify';

dotenv.config();

const prisma = new PrismaClient();

const createdproduct = async (qun: number) => {
  const products: Product[] = [];

  for (let i = 0; i < qun; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product: Product = await prisma.product.create({
      data: {
        name: productName,
        slug: slugify(productName).toLowerCase(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(1, 100, 0, '$'),
        image: faker.datatype
          .array(faker.datatype.number({ max: 10, min: 2 }))
          .map(() => faker.image.imageUrl(500, 500)),
        category: {
          create: {
            name: categoryName,
            slug: slugify(categoryName).toLowerCase(),
          },
        },
        reviews: {
          create: {
            rating: faker.datatype.number({ min: 1, max: 5 }),
            text: faker.lorem.paragraph(),
            userId: faker.datatype.number({ min: 5, max: 8 }),
          },
        },
      },
    });
  }

  //  products.push(products);
  console.log(`Created ${products.length} products`);
};

async function main() {
  console.log('Start seeding...');
  for (let i = 0; i < 100; i++) {
    console.log(i)
    await createdproduct(10);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
