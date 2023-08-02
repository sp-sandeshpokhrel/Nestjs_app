//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy as GithubStr } from 'passport-github';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: number; username?: string }) {
    if (!payload) {
      this.logger.error('Invalid JWT, Could not validate payload');
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(payload.userId);
    if (!user) {
      const socialUser = await this.prisma.socialLogin.findUnique({
        where: { id: payload.userId },
      });
      if (!socialUser) {
        this.logger.error('Invalid JWT, Could not validate payload');
        throw new UnauthorizedException();
      }
      return { userId: payload.userId, username: socialUser.username };
    }
    this.logger.log(`Validated JWT for user`);
    return user;
  }
}

@Injectable()
export class GithubStrategy extends PassportStrategy(GithubStr, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/callback',
      scope: ['public_profile'],
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    return profile;
  }
}
