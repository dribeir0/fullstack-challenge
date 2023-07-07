import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SkipAuth } from 'src/decorators/skipAuth.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  create(@Body() project: CreateProjectDto) {
    return this.projectsService.create(project);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @SkipAuth()
  @Get('soft-deleted')
  findSoftDeleted() {
    return this.projectsService.findSoftDeleted();
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @SkipAuth()
  @Get('search/:searchTerm')
  search(@Param('searchTerm') searchTerm: string) {
    return this.projectsService.search(searchTerm);
  }
}
