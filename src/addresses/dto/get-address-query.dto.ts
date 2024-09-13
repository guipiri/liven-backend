import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetAddressQueryDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cep?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
