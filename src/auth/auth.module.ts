import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { GithubStrategy, JwtStrategy } from './auth.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'HELLO', //process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' }, // e.g. 30s, 7d, 24h
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GithubStrategy],
})
export class AuthModule {}
