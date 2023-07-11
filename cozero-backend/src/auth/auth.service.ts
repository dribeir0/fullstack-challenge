import { forwardRef, Inject, Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../users/dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './local-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (user && isPasswordMatch) {
      return await this.login(user);
    }
    return null;
  }

  @UseGuards(LocalAuthGuard)
  async login(user: UserLoginDto) {
    const payload = { email: user.email };
    return {
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
