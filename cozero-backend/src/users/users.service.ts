import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: UserLoginDto) {
    const userWithHashedPassword = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const user = await this.findOne(createUserDto.email);
    if (!user) {
      return await this.usersRepository.save(userWithHashedPassword);
    }

    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  update(id: number, updateUserDto: UserLoginDto) {
    // TODO: implement
    return `This action updates a #${id} project`;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}