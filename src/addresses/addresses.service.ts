import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { GetAddressQueryDto } from './dto/get-address-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto, userId: string) {
    return await this.addressRepository.save({ ...createAddressDto, userId });
  }

  async findAll(
    userId: string,
    { alias, cep, city, country, id, state }: GetAddressQueryDto,
  ) {
    return await this.addressRepository.find({
      where: { userId, alias, cep, city, country, id, state },
    });
  }

  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    return await this.addressRepository.update(
      { id, userId },
      updateAddressDto,
    );
  }

  async remove(id: string, userId: string) {
    return await this.addressRepository.delete({ id, userId });
  }
}
