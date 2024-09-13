import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create({ email, password }: CreateUserDto) {
    return await this.userRepository.save({
      email,
      password: bcryptHashSync(password, 10),
    });
  }

  async findAll() {
    return await this.userRepository.find({ relations: { addresses: true } });
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { addresses: true },
    });
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: string) {
    return await this.userRepository.delete({ id });
  }
}
