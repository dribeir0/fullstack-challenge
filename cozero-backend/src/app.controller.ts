import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { SkipAuth } from './decorators/skipAuth.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Get('health')
  async healthCheck() {
    return 'OK';
  }

  @SkipAuth()
  @Get('health-db')
  async healthDBCheck() {
    return this.appService.healthDBCheck();
  }
}
