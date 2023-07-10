import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Patch,
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
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchTerm') searchTerm: string = '',
  ) {
    return this.projectsService.findAll(page, limit, searchTerm);
  }

  @SkipAuth()
  @Get('deleted')
  findSoftDeleted(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.projectsService.findSoftDeleted(page, limit);
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

  @Patch(':id')
  restore(@Param('id') id: string) {
    return this.projectsService.restore(+id);
  }
}
