import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ROLES } from 'src/constants/roles';

export class EditUserDto {

  @ApiProperty()
  @IsOptional()
  @IsEnum(ROLES)
  role?: ROLES;

  @ApiProperty()
  @IsOptional()
  @IsString()
  company?: string;
}
