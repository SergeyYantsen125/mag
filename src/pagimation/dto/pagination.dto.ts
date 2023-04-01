import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  perPage?: string;
}
