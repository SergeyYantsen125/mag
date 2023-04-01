import { IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  name: string;
}
