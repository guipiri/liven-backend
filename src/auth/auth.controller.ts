import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto, SignInWithCredentialsDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User authenticated', type: AuthDto })
  @Post('credentials')
  async signInWithCredentials(
    @Body() signInWithCredentialsDto: SignInWithCredentialsDto,
  ): Promise<AuthDto> {
    return await this.authService.signInWithCredentials(
      signInWithCredentialsDto,
    );
  }
}
