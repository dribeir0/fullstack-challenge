import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { DuplicateEmailException, UsersService } from './users.service';
import { UserLoginDto } from './dto/user-login.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let serviceMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    serviceMock = module.get<UsersService>(UsersService);
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

    serviceMock.create.mockReturnValue(expectedUser);

    const result = await controller.create(createUserDto);

    expect(result).toEqual(expectedUser);
    expect(serviceMock.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should not create a new user if email already exists', async () => {
    const createUserDto: UserLoginDto = {
      email: 'email@test.com',
      password: 'password',
    };
    const expectedError = new DuplicateEmailException();

    serviceMock.create.mockRejectedValue(expectedError);

    await expect(controller.create(createUserDto)).rejects.toThrowError();
    expect(serviceMock.create).toHaveBeenCalledWith(createUserDto);
  });
});
