import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PAY_TYPES } from 'src/constants/pay_types';

export default class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  payType: PAY_TYPES;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hours?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  companyId: number;
}