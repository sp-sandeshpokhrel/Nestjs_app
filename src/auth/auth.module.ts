import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { GithubStrategy, Jwt2Strategy, JwtStrategy } from './auth.strategy';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtSecret = configService.get<string>('JWT_SECRET'); //should be in env

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GithubStrategy, Jwt2Strategy],
})
export class AuthModule {}
