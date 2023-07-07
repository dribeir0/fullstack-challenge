import { Body, Controller, Get, Post } from '@nestjs/common';
import { SkipAuth } from 'src/decorators/skipAuth.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @SkipAuth()
  @Post('sign-up')
  create(@Body() user: UserLoginDto) {
    return this.userService.create(user);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
