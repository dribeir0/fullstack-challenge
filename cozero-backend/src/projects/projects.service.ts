import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

  async findAll(page: number, limit: number): Promise<PaginatedProjectsDto> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await this.projectsRepository.findAndCount({
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

  async findSoftDeleted(): Promise<Project[]> {
    return this.projectsRepository.find({ withDeleted: true });
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

  async search(searchTerm: string) {
    return this.projectsRepository.find({
      where: [
        { name: ILike(`%${searchTerm || ''}%`) },
        { description: ILike(`%${searchTerm || ''}%`) },
      ],
    });
  }
}
