import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectsRepository.save(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  async findOne(id: number) {
    return await this.projectsRepository.findOneBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectsRepository.update({ id }, updateProjectDto);
  }

  async remove(id: number) {
    return this.projectsRepository.delete(id);
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
