import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const newUser: User = {
  createdAt: new Date(),
  email: 'email2',
  id: 'id',
  password: 'password',
  updatedAt: new Date(),
  addresses: [],
};
const updateResut: UpdateResult = {
  generatedMaps: [],
  raw: '',
  affected: 1,
};
const deleteResult: DeleteResult = {
  raw: '',
  affected: 1,
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(newUser),
            findOneBy: jest.fn().mockResolvedValue(newUser),
            update: jest.fn().mockResolvedValue(updateResut),
            delete: jest.fn().mockResolvedValue(deleteResult),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return the user created', async () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      //Act
      const res = await userService.create(body);
      //Assert
      expect(res).toEqual(newUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if email already exists', async () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(newUser);

      //Assert
      expect(userService.create(body)).rejects.toThrow(
        new ConflictException('Este email já existe'),
      );
    });
    it('should throw an exception if save throw error', () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
      };
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.create(body)).rejects.toThrow(new Error());
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      //Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(newUser);
      //Act
      const res = await userService.findOne('id');
      //Assert
      expect(res).toEqual(newUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        relations: { addresses: true },
        where: { id: 'id' },
      });
    });

    it('should return null if no user is found', async () => {
      //Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      //Act
      const res = await userRepository.findOne({
        where: { id: 'id' },
        relations: { addresses: true },
      });
      //Assert
      expect(res).toEqual(null);
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      //Arrange
      const email = 'email';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(newUser);
      //Act
      const res = await userService.findByEmail(email);
      //Assert
      expect(res).toEqual(newUser);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return throw not found exception if no user is found', async () => {
      //Arrange
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      //Assert
      expect(userService.findByEmail('email')).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });

  describe('update', () => {
    it('should return the update operation result', async () => {
      //Arrange
      const id = 'id';
      const updateUserDto: UpdateUserDto = {
        email: 'email-updated',
        password: 'password-updated',
      };
      //Act
      const res = await userService.update(id, updateUserDto);
      //Assert
      expect(res).toEqual(updateResut);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should return the delete operation result', async () => {
      //Arrange
      const id = 'id';
      //Act
      const res = await userService.remove(id);
      //Assert
      expect(res).toEqual(deleteResult);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
