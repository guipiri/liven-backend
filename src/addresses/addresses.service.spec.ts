import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { GetAddressQueryDto } from './dto/get-address-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

const newAddress: Address = {
  id: 'id',
  address: 'endereço',
  alias: 'alias',
  number: 0,
  cep: 'cep',
  city: 'city',
  country: 'country',
  state: 'state',
  userId: 'userId',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createAddressDto: CreateAddressDto = {
  address: 'endereço',
  alias: 'alias',
  cep: 'cep',
  city: 'city',
  country: 'country',
  state: 'state',
};

const updateAddressDto: UpdateAddressDto = {
  address: 'address-updated',
  alias: 'alias-updated',
  cep: 'cep-updated',
  city: 'city-updated',
  country: 'country-updated',
  state: 'state-updated',
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

describe('AddressesService', () => {
  let addressService: AddressesService;
  let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            save: jest.fn().mockResolvedValue(newAddress),
            find: jest.fn().mockResolvedValue([newAddress]),
            update: jest.fn().mockResolvedValue(updateResut),
            delete: jest.fn().mockResolvedValue(deleteResult),
          },
        },
      ],
    }).compile();

    addressService = module.get<AddressesService>(AddressesService);
    addressRepository = module.get<Repository<Address>>(
      getRepositoryToken(Address),
    );
  });

  it('should be defined', () => {
    expect(addressService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return the address created', async () => {
      const res = await addressService.create(createAddressDto, 'id');
      expect(res).toEqual(newAddress);
      expect(addressRepository.save).toHaveBeenCalledTimes(1);
      expect(addressRepository.save).toHaveBeenCalledWith({
        ...createAddressDto,
        userId: 'id',
      });
    });

    it('should throw an exception if save throw error', () => {
      jest.spyOn(addressRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(addressService.create(createAddressDto, 'id')).rejects.toThrow(
        new Error(),
      );
    });
  });

  describe('findAll', () => {
    it('should return the addresses of requesting user', async () => {
      //Arrange
      const query = new GetAddressQueryDto();
      //Act
      const res = await addressService.findAll('id', query);
      //Assert
      expect(res).toEqual([newAddress]);
      expect(addressRepository.find).toHaveBeenCalledTimes(1);
      expect(addressRepository.find).toHaveBeenCalledWith({
        where: { ...query, userId: 'id' },
      });
    });

    it('should throw an exception if find throw error', () => {
      //Arrange
      const query = new GetAddressQueryDto();
      jest.spyOn(addressRepository, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(addressService.findAll('id', query)).rejects.toThrow(new Error());
    });
  });

  describe('update', () => {
    it('should return the update operation result', async () => {
      const id = 'id';
      const userId = 'userId';
      //Act
      const res = await addressService.update(id, userId, updateAddressDto);
      //Assert
      expect(res).toEqual(updateResut);
      expect(addressRepository.update).toHaveBeenCalledTimes(1);
      expect(addressRepository.update).toHaveBeenCalledWith(
        { id, userId },
        updateAddressDto,
      );
    });
  });

  describe('remove', () => {
    it('should return the delete operation result', async () => {
      //Arrange
      const id = 'id';
      const userId = 'userId';
      //Act
      const res = await addressService.remove(id, userId);
      //Assert
      expect(res).toEqual(undefined);
      expect(addressRepository.delete).toHaveBeenCalledTimes(1);
      expect(addressRepository.delete).toHaveBeenCalledWith({ id, userId });
    });
  });
});
