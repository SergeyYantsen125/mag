import { Prisma } from '@prisma/client';
import {ArrayMinSize, IsNumber, IsOptional, IsString} from 'class-validator';

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  description: string;

  @ArrayMinSize(1)
  @IsString()
  image: string[];

  @IsNumber()
  categoryId: number;
}
