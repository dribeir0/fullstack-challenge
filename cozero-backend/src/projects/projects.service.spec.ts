import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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
});
