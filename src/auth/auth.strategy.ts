//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-github';
import { Strategy as PassportJwtStrategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      this.logger.error('Invalid JWT, Could not validate payload');
      throw new UnauthorizedException();
    }
    this.logger.log(`Validated JWT for user`);
    return user;
  }
}

//auth.strategy.ts

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
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

@Injectable()
export class Jwt2Strategy extends PassportStrategy(
  PassportJwtStrategy,
  'jwt2',
) {
  private readonly logger = new Logger(Jwt2Strategy.name);
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string }) {
    console.log(payload.sub, 'here', payload.username);
    if (!payload) {
      this.logger.error('Invalid JWT, Could not validate payload');
      throw new UnauthorizedException();
    }
    this.logger.log(`Validated JWT for user`);
    return { userId: payload.sub, username: payload.username };
  }
}
