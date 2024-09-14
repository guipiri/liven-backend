import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

const user: User = {
  createdAt: new Date(),
  email: 'email2',
  id: 'id',
  password: 'password',
  updatedAt: new Date(),
  addresses: [],
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation(() => 'token'),
          },
        },
        { provide: ConfigService, useValue: { get: () => 3600 } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('signInWithCredentials', () => {
    it('should return auth dto object with a jwt valid token', async () => {
      //Arrange
      const signInData = { email: 'email', password: 'password' };
      const authDto: AuthDto = {
        token: 'token',
        expiresIn: 3600,
      };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);
      //Act
      const res = await authService.signInWithCredentials(signInData);
      //Assert
      expect(res).toEqual(authDto);
    });
    it('should throw unauthorized exception if password is incorrect', async () => {
      //Arrange
      const signInData = { email: 'email', password: 'password' };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => false);

      //Assert
      expect(authService.signInWithCredentials(signInData)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );
    });

    it('should throw not found exception if email not exists', async () => {
      //Arrange
      const signInData = { email: 'email', password: 'password' };
      jest
        .spyOn(usersService, 'findByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      //Assert
      expect(authService.signInWithCredentials(signInData)).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });
});
