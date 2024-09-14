import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';

describe('JwtAuthGuard', () => {
  const jwtService = new JwtService();
  const configService = new ConfigService();
  const jwtAuthGuard: JwtAuthGuard = new JwtAuthGuard(
    jwtService,
    configService,
  );

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });
});
