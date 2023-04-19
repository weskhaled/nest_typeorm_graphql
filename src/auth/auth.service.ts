import { UserService } from '../user/user.service';
import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { SignInInput, SignUpInput } from 'src/auth/inputs/auth.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { JwtWithUser } from './entities/auth._entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private signJWT(user: User) {
    return this.jwtService.sign(pick(user, ['id', 'role']));
  }

  async signUp(input: SignUpInput): Promise<JwtWithUser> {
    const doesExistId = await this.userService.getOne({
      where: { username: input.username },
    });

    if (doesExistId) {
      throw new BadRequestException('Username already exists');
    }

    const user = await this.userService.create(input);

    return this.signIn(user);
  }

  signIn(user: User) {
    const { accessToken, refreshToken } = this.generateTokens({
      id: user.id,
      role: user.role,
    });

    return { accessToken, refreshToken, user };
  }

  async validateUser(input: SignInInput) {
    const { username, password } = input;

    const user = await this.userService.getOne({ where: { username } });
    if (!user) {
      return null;
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async getUserFromToken(token: string): Promise<User> {
    const id =
      this.jwtService.decode(token) && this.jwtService.decode(token)['id'];
    return id ? await this.userService.getOne({ where: { id } }) : null;
  }

  generateTokens(payload: { id: string; role: string }): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { id: string; role: string }): string {
    return this.jwtService.sign(pick(payload, ['id', 'role']));
  }

  private generateRefreshToken(payload: { id: string; role: string }): string {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    return this.jwtService.sign(pick(payload, ['id', 'role']), {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { id, role } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        id,
        role,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
