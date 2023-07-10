import { Project } from '../entities/project.entity';

export class PaginatedProjectsDto {
  data: Project[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
