import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto, SignInWithCredentialsDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('credentials')
  async signInWithCredentials(
    @Body() signInWithCredentialsDto: SignInWithCredentialsDto,
  ): Promise<AuthDto> {
    return await this.authService.signInWithCredentials(
      signInWithCredentialsDto,
    );
  }
}
