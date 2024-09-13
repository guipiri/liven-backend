import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth.guard';

export function AuthDecorators() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'User unauthorized ' }),
    UseGuards(JwtAuthGuard),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer #your-token-here',
      required: true,
    }),
  );
}
