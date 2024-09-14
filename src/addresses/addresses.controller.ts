import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthDecorators } from '../auth/auth.decorator';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { GetAddressQueryDto } from './dto/get-address-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@AuthDecorators()
@ApiBadRequestResponse({
  description: 'Malformed request',
})
@ApiTags('Address')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiCreatedResponse({
    description: 'Address created',
    type: Address,
  })
  @Post()
  create(
    @Req() { user: { sub: userId } }: Request,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(createAddressDto, userId);
  }

  @ApiOkResponse({ type: [Address] })
  @Get()
  findAll(
    @Query() queryParams: GetAddressQueryDto,
    @Req() { user: { sub: userId } }: Request,
  ) {
    return this.addressesService.findAll(userId, queryParams);
  }

  @ApiOkResponse({ description: 'Address updated' })
  @Patch(':id')
  update(
    @Req() { user: { sub: userId } }: Request,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, userId, updateAddressDto);
  }

  @ApiOkResponse({ description: 'Address deleted' })
  @Delete(':id')
  remove(@Req() { user: { sub: userId } }: Request, @Param('id') id: string) {
    return this.addressesService.remove(id, userId);
  }
}
