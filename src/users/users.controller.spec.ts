import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'express';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const newUser: User = {
  id: 'id',
  email: 'email',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const req = request;
req.user = { sub: 'userId', email: 'email', exp: 0, iat: 0 };
const changeResult: UpdateResult = { affected: 1, raw: '', generatedMaps: [] };

describe('UsersController', () => {
  let userController: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: () => undefined,
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUser),
            findOne: jest.fn().mockResolvedValue(newUser),
            update: jest.fn().mockResolvedValue(changeResult),
            remove: jest.fn().mockResolvedValue(changeResult),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    it('should return the user created', async () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
      };
      //Act
      const result = await userController.create(body);
      //Assert
      expect(result).toEqual(newUser);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(usersService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
      };
      jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error());
      //Assert
      expect(userController.create(body)).rejects.toThrow(new Error());
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      //Act
      const result = await userController.findOne(req);
      //Assert
      expect(result).toEqual(newUser);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.findOne).toHaveBeenCalledWith(req.user.sub);
    });

    it('should throw an exception', () => {
      //Arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());
      //Assert
      expect(userController.findOne(req)).rejects.toThrow(new Error());
    });
  });

  describe('update', () => {
    it('should return a the result of operation of the address update', async () => {
      //Arrange
      const body: UpdateUserDto = {
        email: 'email-changed',
        password: 'password-changed',
      };
      //Act
      const result = await userController.update(req, body);
      //Assert
      expect(result).toEqual(changeResult);
      expect(usersService.update).toHaveBeenCalledTimes(1);
      expect(usersService.update).toHaveBeenCalledWith(req.user.sub, body);
    });

    it('should throw an exception', () => {
      //Arrange
      const body: UpdateUserDto = {
        email: 'email-changed',
        password: 'password-changed',
      };
      jest.spyOn(usersService, 'update').mockRejectedValueOnce(new Error());
      //Assert
      expect(userController.update(req, body)).rejects.toThrow(new Error());
    });
  });

  describe('remove', () => {
    it('should return a the result of operation of the address deletion', async () => {
      //Arrange

      //Act
      const result = await userController.remove(req);
      //Assert
      expect(result).toEqual(changeResult);
      expect(usersService.remove).toHaveBeenCalledTimes(1);
      expect(usersService.remove).toHaveBeenCalledWith(req.user.sub);
    });

    it('should throw an exception', () => {
      jest.spyOn(usersService, 'remove').mockRejectedValueOnce(new Error());
      //Assert
      expect(userController.remove(req)).rejects.toThrow(new Error());
    });
  });
});
