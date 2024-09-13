import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    return await this.addressRepository.save(createAddressDto);
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  async findOne(id: string) {
    return await this.addressRepository.findOne({ where: { id } });
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    return await this.addressRepository.update({ id }, updateAddressDto);
  }

  async remove(id: string) {
    return await this.addressRepository.delete({ id });
  }
}
