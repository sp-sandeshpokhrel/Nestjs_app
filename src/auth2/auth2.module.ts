import { Module } from '@nestjs/common';
import { GithubStrategy, JwtStrategy } from './auth2.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Auth2Controller } from './auth2.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          signOptions: { expiresIn: '10h' },
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [Auth2Controller],
  providers: [GithubStrategy, JwtStrategy],
})
export class Auth2Module {}
