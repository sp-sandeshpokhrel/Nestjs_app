//auth.controller.ts

import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth2')
@ApiTags('auth2')
export class Auth2Controller {
  private readonly logger = new Logger(Auth2Controller.name);
  constructor(private jwtService: JwtService) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {
    console.log('here');
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    const user = req.user;
    console.log(user);
    const payload = { username: user.username, sub: user.id };
    this.logger.log(`Got JWT for Authenticated User`);
    return { accessToken: this.jwtService.sign(payload) };
  }
}
