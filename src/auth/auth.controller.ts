//src/auth/auth.controller.ts

import {
  Get,
  Req,
  Body,
  Controller,
  Post,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async login2() {
    //
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
