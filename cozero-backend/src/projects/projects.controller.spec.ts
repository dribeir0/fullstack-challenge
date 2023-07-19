import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { User } from '../users/entities/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UnauthorizedException } from '@nestjs/common';

const projectDto: CreateProjectDto = {
  name: 'Test Project',
  description: 'description',
  co2EstimateReduction: [0, 1],
  owner: 'email@email.com',
  listing: ['1'],
};

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let serviceMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        {
          provide: ProjectsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findSoftDeleted: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    serviceMock = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a project', async () => {
    await controller.create(projectDto);

    expect(serviceMock.create).toHaveBeenCalledWith(projectDto);
  });

  it('should not create a project if the token is not valid', async () => {
    jest
      .spyOn(serviceMock, 'create')
      .mockRejectedValue(new UnauthorizedException());

    await expect(controller.create(projectDto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(serviceMock.create).toHaveBeenCalledWith(projectDto);
  });

  it('should return all projects', async () => {
    const page = 1;
    const limit = 10;
    const searchTerm = '';

    await controller.findAll(page, limit, searchTerm);

    expect(serviceMock.findAll).toHaveBeenCalledWith(page, limit, searchTerm);
  });

  it('should return soft deleted projects', async () => {
    const page = 1;
    const limit = 10;
    const request: any = {
      user: { email: 'email@email.com' } as User,
    };

    await controller.findSoftDeleted(page, limit, request);

    expect(serviceMock.findSoftDeleted).toHaveBeenCalledWith(
      page,
      limit,
      request.user.email,
    );
  });

  it('should return a specific project', async () => {
    const id = '1';

    await controller.findOne(id);

    expect(serviceMock.findOne).toHaveBeenCalledWith(+id);
  });

  it('should update a specific project', async () => {
    const id = '1';
    const updateProjectDto: UpdateProjectDto = { name: 'Updated Project' };
    const request: any = {
      user: { email: 'email@email.com' } as User,
    };

    await controller.update(id, updateProjectDto, request);

    expect(serviceMock.update).toHaveBeenCalledWith(
      +id,
      updateProjectDto,
      request.user.email,
    );
  });

  it('should remove a specific project', async () => {
    const id = '1';
    const request: any = {
      user: { email: 'email@email.com' } as User,
    };

    await controller.remove(id, request);

    expect(serviceMock.remove).toHaveBeenCalledWith(+id, request.user.email);
  });

  it('should restore a specific project', async () => {
    const id = '1';
    const request: any = {
      user: { email: 'email@email.com' } as User,
    };

    await controller.restore(id, request);

    expect(serviceMock.restore).toHaveBeenCalledWith(+id, request.user.email);
  });
});
