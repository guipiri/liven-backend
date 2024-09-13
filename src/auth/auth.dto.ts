import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class AuthDto {
  token: string;
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
