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
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SkipAuth } from '../decorators/skipAuth.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

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

  @UseGuards(JwtAuthGuard)
  @Get('deleted')
  findSoftDeleted(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() request: Request & { user: User },
  ) {
    return this.projectsService.findSoftDeleted(
      page,
      limit,
      request.user.email,
    );
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: Request & { user: User },
  ) {
    return this.projectsService.update(
      +id,
      updateProjectDto,
      request.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request & { user: User }) {
    return this.projectsService.remove(+id, request.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  restore(@Param('id') id: string, @Req() request: Request & { user: User }) {
    return this.projectsService.restore(+id, request.user.email);
  }
}
