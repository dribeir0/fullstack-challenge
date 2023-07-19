import { IsArray, IsNumber } from 'class-validator';
import { Project } from '../entities/project.entity';

export class PaginatedProjectsDto {
  @IsArray()
  data: Project[];
  @IsNumber()
  page: number;
  @IsNumber()
  perPage: number;
  @IsNumber()
  totalItems: number;
  @IsNumber()
  totalPages: number;
}
