import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PAY_TYPES } from 'src/constants/pay_types';

export default class EditEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  payType: PAY_TYPES;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hours?: number;
}