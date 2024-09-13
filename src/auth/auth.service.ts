import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthDto, SignInWithCredentialsDto } from './auth.dto';

@Injectable()
export class AuthService {
  private expiresIn: number;
  private webClientId: string;
  private iosClientId: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.expiresIn = this.configService.get<number>('JWT_EXPIRATION_SECONDS');
    this.webClientId = this.configService.get<string>('WEB_CLIENT_ID');
    this.iosClientId = this.configService.get<string>('IOS_CLIENT_ID');
  }

  async signInWithCredentials({
    email,
    password,
  }: SignInWithCredentialsDto): Promise<AuthDto> {
    const user = await this.userService.findByEmail(email);
    if (!bcryptCompareSync(password, user.password))
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
