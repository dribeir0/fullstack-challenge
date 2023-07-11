import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        AuthService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
    jwtServiceMock = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: UserLoginDto = {
      email: 'email@test.com',
      password: 'password',
    };

    const expectedUser = {
      email: createUserDto.email,
      access_token: 'token',
    };

    repositoryMock.create.mockReturnValue(expectedUser);
    repositoryMock.findOneBy.mockReturnValue(null);
    repositoryMock.save.mockResolvedValue(expectedUser);
    jwtServiceMock.sign.mockReturnValue('token');

    const user = await service.create(createUserDto);

    expect(user).toEqual(expectedUser);
  });

  it('should not create a new user if email already exists', async () => {
    const createUserDto: UserLoginDto = {
      email: 'email@test.com',
      password: 'password',
    };

    const expectedUser = {
      email: createUserDto.email,
      access_token: 'token',
    };

    repositoryMock.create.mockReturnValue(expectedUser);
    repositoryMock.findOneBy.mockReturnValue({
      email: 'email@test.com',
    });
    repositoryMock.save.mockResolvedValue(expectedUser);
    jwtServiceMock.sign.mockReturnValue('token');

    await expect(service.create(createUserDto)).rejects.toThrowError();
  });
});
