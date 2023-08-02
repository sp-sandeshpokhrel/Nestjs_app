// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Logger,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    if (!data) {
      this.logger.log(`Couldn't create user`);
      throw new InternalServerErrorException({
        error: 'PrismaError',
        message: 'User not created',
      });
    }
    this.logger.log(`Created user with id ${data.id}`);
    return new UserEntity(data);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(
    @Request() req,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    console.log('In here', req.user);
    let query = {};
    if (skip && take) query = { skip: +skip, take: +take };
    const users = await this.usersService.findAll(query);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      this.logger.log(`Couldn't find user with id ${id}`);
      throw new InternalServerErrorException({
        error: 'PrismaError',
        message: 'User not found',
      });
    }
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.usersService.update(id, updateUserDto);
    if (!data) {
      this.logger.log(`Couldn't update user`);
      throw new InternalServerErrorException({
        error: 'PrismaError',
        message: 'User not updated',
      });
    }
    this.logger.log(`Updated user with id ${data.id}`);
    return new UserEntity(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.remove(id);
    if (!data) {
      this.logger.log(`Couldn't delete user`);
      throw new InternalServerErrorException({
        error: 'PrismaError',
        message: 'User not deleted',
      });
    }
    this.logger.log(`Deleted user with id ${data.id}`);
    return new UserEntity(data);
  }
}
