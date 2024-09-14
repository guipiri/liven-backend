import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';

export class AuthDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresIn: number;
}

export class SignInWithCredentialsDto extends CreateUserDto {}

export interface RequestWithUser extends Request {
  user: AuthUser;
}

export class AuthUser {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
