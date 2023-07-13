//auth.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth2')
@ApiTags('auth2')
export class Auth2Controller {
  constructor(private jwtService: JwtService) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  async login() {
    console.log('here');
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    console.log('hera');
    const user = req.user;
    console.log(user);
    const payload = { username: user.username, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
