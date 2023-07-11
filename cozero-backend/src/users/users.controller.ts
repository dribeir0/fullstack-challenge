import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { SkipAuth } from '../decorators/skipAuth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @SkipAuth()
  @Post('sign-up')
  create(@Body() user: UserLoginDto) {
    return this.userService.create(user);
  }
}
