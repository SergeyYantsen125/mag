import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {PrismaService} from "../prisma.service";
import {PagimationService} from "../pagimation/pagimation.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PagimationService]
})
export class ProductModule {}
