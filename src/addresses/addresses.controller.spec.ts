import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'express';
import { UpdateResult } from 'typeorm';
import { AddressesController } from './addresses.controller';
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

const body: CreateAddressDto = {
  address: 'endereço',
  alias: 'alias',
  cep: 'cep',
  city: 'city',
  country: 'country',
  state: 'state',
};
const req = request;
req.user = { sub: 'userId', email: 'email', exp: 0, iat: 0 };

const changeResult: UpdateResult = { affected: 1, raw: '', generatedMaps: [] };
describe('AddressesController', () => {
  let addressController: AddressesController;
  let addressService: AddressesService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
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
          provide: AddressesService,
          useValue: {
            create: jest.fn().mockResolvedValue(newAddress),
            findAll: jest.fn().mockResolvedValue([newAddress]),
            update: jest.fn().mockResolvedValue(changeResult),
            remove: jest.fn().mockResolvedValue(changeResult),
          },
        },
      ],
      imports: [],
    }).compile();

    addressController = module.get<AddressesController>(AddressesController);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    addressService = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(addressController).toBeDefined();
    expect(addressService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    it('should return the address created', async () => {
      //Act
      const result = await addressController.create(req, body);
      //Assert
      expect(result).toEqual(newAddress);
      expect(addressService.create).toHaveBeenCalledTimes(1);
      expect(addressService.create).toHaveBeenCalledWith(body, req.user.sub);
    });

    it('should throw an exception', () => {
      //Arragen
      jest.spyOn(addressService, 'create').mockRejectedValueOnce(new Error());
      //Assert
      expect(addressController.create(req, body)).rejects.toThrow(new Error());
    });
  });

  describe('findAll', () => {
    it('should return a list of address', async () => {
      //Arrange
      const query = new GetAddressQueryDto();
      //Act
      const result = await addressController.findAll(query, req);
      //Assert
      expect(result).toEqual([newAddress]);
      expect(addressService.findAll).toHaveBeenCalledTimes(1);
      expect(addressService.findAll).toHaveBeenCalledWith(req.user.sub, query);
    });

    it('should throw an exception', () => {
      //Arragen
      const query = new GetAddressQueryDto();
      jest.spyOn(addressService, 'findAll').mockRejectedValueOnce(new Error());
      //Assert
      expect(addressController.findAll(query, req)).rejects.toThrow(
        new Error(),
      );
    });
  });

  describe('update', () => {
    it('should return a the result of operation of the address update', async () => {
      //Arrange
      const body: UpdateAddressDto = {
        address: 'address-updated',
        alias: 'alias-updated',
        cep: 'cep-updated',
        city: 'city-updated',
        country: 'country-updated',
        state: 'state-updated',
      };
      //Act
      const result = await addressController.update(req, 'id', body);
      //Assert
      expect(result).toEqual(changeResult);
      expect(addressService.update).toHaveBeenCalledTimes(1);
      expect(addressService.update).toHaveBeenCalledWith(
        'id',
        req.user.sub,
        body,
      );
    });

    it('should throw an exception', () => {
      //Arrage
      const body: UpdateAddressDto = {
        address: 'address-updated',
        alias: 'alias-updated',
        cep: 'cep-updated',
        city: 'city-updated',
        country: 'country-updated',
        state: 'state-updated',
      };
      jest.spyOn(addressService, 'update').mockRejectedValueOnce(new Error());
      //Assert
      expect(addressController.update(req, 'id', body)).rejects.toThrow(
        new Error(),
      );
    });
  });

  describe('remove', () => {
    it('should return a the result of operation of the address deletion', async () => {
      //Arrange

      //Act
      const result = await addressController.remove(req, 'id');
      //Assert
      expect(result).toEqual(changeResult);
      expect(addressService.remove).toHaveBeenCalledTimes(1);
      expect(addressService.remove).toHaveBeenCalledWith('id', req.user.sub);
    });

    it('should throw an exception', () => {
      jest.spyOn(addressService, 'remove').mockRejectedValueOnce(new Error());
      //Assert
      expect(addressController.remove(req, 'id')).rejects.toThrow(new Error());
    });
  });
});
