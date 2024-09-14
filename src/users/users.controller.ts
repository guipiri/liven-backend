import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthDecorators } from '../auth/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBadRequestResponse({
  description: 'Malformed request',
})
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConflictResponse({
    description: 'Email already exist',
  })
  @ApiCreatedResponse({
    description: 'User created',
    type: User,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @AuthDecorators()
  @ApiOkResponse({ type: User })
  findOne(@Req() { user: { sub: id } }: Request) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @AuthDecorators()
  @ApiOkResponse({ description: 'User updated' })
  update(
    @Req() { user: { sub: id } }: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @AuthDecorators()
  @ApiOkResponse({ description: 'User deleted' })
  remove(@Req() { user: { sub: id } }: Request) {
    return this.usersService.remove(id);
  }
}
