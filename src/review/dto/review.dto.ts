import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Prisma } from '@prisma/client';

export class ReviewDto {
  @Max(5)
  @Min(1)
  @IsNumber()
  rating: number;

  @IsString()
  text: string;
}
