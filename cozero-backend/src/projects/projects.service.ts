import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { PaginatedProjectsDto } from './dto/paginated-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectsRepository.save(createProjectDto);
  }

  private async findPaginated(
    page: number,
    limit: number,
    searchTerm = '',
    softDeleted = false,
  ) {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.projectsRepository.findAndCount({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      ...(softDeleted
        ? { withDeleted: softDeleted, where: { deletedAt: Not(IsNull()) } }
        : {}),
      skip,
      take: limit,
    });

    return {
      data,
      page,
      perPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async findAll(
    page: number,
    limit: number,
    searchTerm: string,
  ): Promise<PaginatedProjectsDto> {
    return await this.findPaginated(page, limit, searchTerm);
  }

  async findSoftDeleted(
    page: number,
    limit: number,
  ): Promise<PaginatedProjectsDto> {
    return await this.findPaginated(page, limit, '', true);
  }

  async findOne(id: number) {
    return await this.projectsRepository.findOneBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectsRepository.update({ id }, updateProjectDto);
  }

  async remove(id: number) {
    return this.projectsRepository.softDelete({ id });
  }

  async search(page: number, limit: number, searchTerm: string) {
    return await this.findPaginated(page, limit, searchTerm);
  }

  async restore(id: number) {
    return this.projectsRepository.restore({ id });
  }
}
