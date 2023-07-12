import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { PaginatedProjectsDto } from './dto/paginated-projects.dto';
import { NotOwnerException } from '../exceptions/not-owner.exception';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectsRepository.save(createProjectDto);
  }

  async findAll(
    page: number,
    limit: number,
    searchTerm: string,
  ): Promise<PaginatedProjectsDto> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.projectsRepository.findAndCount({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      order: {
        createdAt: 'DESC',
      },
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

  async findSoftDeleted(
    page: number,
    limit: number,
    owner: string,
  ): Promise<PaginatedProjectsDto> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.projectsRepository.findAndCount({
      withDeleted: true,
      where: { owner, deletedAt: Not(IsNull()) },
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

  async findOne(id: number) {
    return await this.projectsRepository.findOneBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, email: string) {
    const project = await this.findOne(id);
    if (project.owner !== email) {
      throw new NotOwnerException();
    }
    return this.projectsRepository.update({ id }, updateProjectDto);
  }

  async remove(id: number, email: string) {
    const project = await this.findOne(id);
    if (project.owner !== email) {
      throw new NotOwnerException();
    }
    return this.projectsRepository.softDelete({ id });
  }

  async restore(id: number, email: string) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted records
    });
    if (project.owner !== email) {
      throw new NotOwnerException();
    }
    return this.projectsRepository.restore({ id });
  }
}
