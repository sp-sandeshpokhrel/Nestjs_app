//src/auth/auth.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async socialLogin(userId: number, username: string): Promise<any> {
    let user = await this.prisma.socialLogin.findUnique({
      where: { id: userId },
    });
    if (!user) {
      user = await this.prisma.socialLogin.create({
        data: { id: userId, username: username },
      });
    }
    this.logger.log(`Generated JWT for user`);
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
        username: username,
      }),
    };
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    this.logger.log(`Generated JWT for user`);
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
