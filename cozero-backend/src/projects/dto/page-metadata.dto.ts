import { IsNumber } from 'class-validator';

export class PageMetadataDto {
  @IsNumber()
  page: number;
  @IsNumber()
  perPage: number;
  @IsNumber()
  total: number;
  @IsNumber()
  totalPages: number;
}
