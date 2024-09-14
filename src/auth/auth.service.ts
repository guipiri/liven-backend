import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDto, SignInWithCredentialsDto } from './auth.dto';

@Injectable()
export class AuthService {
  private expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.expiresIn = this.configService.get<number>('JWT_EXPIRATION_SECONDS');
  }

  async signInWithCredentials({
    email,
    password,
  }: SignInWithCredentialsDto): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);
    if (!compareSync(password, user.password))
      throw new UnauthorizedException('Credenciais inválidas');
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      token: this.jwtService.sign(payload),
      expiresIn: this.expiresIn,
    };
  }
}
