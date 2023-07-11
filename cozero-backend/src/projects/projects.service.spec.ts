import { Test, TestingModule } from '@nestjs/testing';
import { NotOwnerException, ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';

const projectDto: CreateProjectDto = {
  name: 'Test Project',
  description: 'description',
  co2EstimateReduction: [0, 1],
  owner: 'email@email.com',
  listing: ['1'],
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repositoryMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            findAndCount: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            restore: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repositoryMock = module.get(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const createdProject = { id: 1, name: 'Test Project' };

    repositoryMock.save.mockResolvedValue(createdProject);

    const result = await service.create(projectDto);

    expect(repositoryMock.save).toHaveBeenCalledWith(projectDto);
    expect(result).toEqual(createdProject);
  });

  it('should return paginated projects', async () => {
    const page = 1;
    const limit = 10;
    const searchTerm = 'test';
    const projects = [
      { id: 1, name: 'Test Project 1' },
      { id: 2, name: 'Test Project 2' },
    ];

    repositoryMock.findAndCount.mockResolvedValue([projects, projects.length]);

    const result = await service.findAll(page, limit, searchTerm);

    expect(result.data).toEqual(projects);
    expect(result.page).toEqual(page);
    expect(result.perPage).toEqual(limit);
    expect(result.totalItems).toEqual(projects.length);
    expect(result.totalPages).toEqual(1);
  });

  it('should return paginated soft deleted projects', async () => {
    const page = 1;
    const limit = 10;
    const owner = 'email@email.com';
    const projects = [
      { id: 1, name: 'Deleted Project 1' },
      { id: 2, name: 'Deleted Project 2' },
    ];

    repositoryMock.findAndCount.mockResolvedValue([projects, projects.length]);

    const result = await service.findSoftDeleted(page, limit, owner);

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        withDeleted: true,
        where: { owner, deletedAt: expect.any(Object) },
        skip: 0,
        take: 10,
      }),
    );
    expect(result.data).toEqual(projects);
    expect(result.page).toEqual(page);
    expect(result.perPage).toEqual(limit);
    expect(result.totalItems).toEqual(projects.length);
    expect(result.totalPages).toEqual(1);
  });

  it('should return a specific project', async () => {
    const id = 1;
    const project = { id, name: 'Test Project' };

    repositoryMock.findOneBy.mockResolvedValue(project);

    const result = await service.findOne(id);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    expect(result).toEqual(project);
  });

  it('should update a project if the user is the owner', async () => {
    const id = 1;
    const updateProjectDto = { name: 'Updated Project' };
    const email = 'email@email.com';

    const existingProject = { id, name: 'Test Project', owner: email };

    repositoryMock.findOneBy.mockResolvedValue(existingProject);

    await service.update(id, updateProjectDto, email);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    expect(repositoryMock.update).toHaveBeenCalledWith(
      { id },
      updateProjectDto,
    );
  });

  it('should throw NotOwnerException if the user is not the owner', async () => {
    const id = 1;
    const updateProjectDto = { name: 'Updated Project' };
    const email = 'email@email.com';

    const existingProject = {
      id,
      name: 'Test Project',
      owner: 'other@example.com',
    };

    repositoryMock.findOneBy.mockResolvedValue(existingProject);

    await expect(service.update(id, updateProjectDto, email)).rejects.toThrow(
      NotOwnerException,
    );

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it('should remove a project if the user is the owner', async () => {
    const id = 1;
    const email = 'email@email.com';

    const existingProject = { id, name: 'Test Project', owner: email };

    repositoryMock.findOneBy.mockResolvedValue(existingProject);

    await service.remove(id, email);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    expect(repositoryMock.softDelete).toHaveBeenCalledWith({ id });
  });

  it('should throw NotOwnerException if the user is not the owner', async () => {
    const id = 1;
    const email = 'email@email.com';

    const existingProject = {
      id,
      name: 'Test Project',
      owner: 'other@example.com',
    };

    repositoryMock.findOneBy.mockResolvedValue(existingProject);

    await expect(service.remove(id, email)).rejects.toThrow(NotOwnerException);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    expect(repositoryMock.softDelete).not.toHaveBeenCalled();
  });

  it('should restore a soft deleted project if the user is the owner', async () => {
    const id = 1;
    const email = 'email@email.com';

    const existingProject = { id, name: 'Test Project', owner: email };

    repositoryMock.findOne.mockResolvedValue(existingProject);

    await service.restore(id, email);

    expect(repositoryMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id },
        withDeleted: true,
      }),
    );
    expect(repositoryMock.restore).toHaveBeenCalledWith({ id });
  });

  it('should throw NotOwnerException if the user is not the owner', async () => {
    const id = 1;
    const email = 'email@email.com';

    const existingProject = {
      id,
      name: 'Test Project',
      owner: 'other@email.com',
    };

    repositoryMock.findOne.mockResolvedValue(existingProject);

    await expect(service.restore(id, email)).rejects.toThrow(NotOwnerException);

    expect(repositoryMock.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id },
        withDeleted: true,
      }),
    );
    expect(repositoryMock.restore).not.toHaveBeenCalled();
  });
});
