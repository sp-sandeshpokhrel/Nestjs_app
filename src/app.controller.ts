import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt2'))
  @Get('profile')
  @ApiTags('profile')
  @ApiBearerAuth()
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('hello')
  @HttpCode(201)
  create(): string {
    return 'Created post';
  }
}
