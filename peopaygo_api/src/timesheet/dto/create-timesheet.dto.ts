import { IsNotEmpty, IsDate, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateTimesheetDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsDate()
  checkDate: Date;

  @IsOptional()
  @ArrayNotEmpty()
  employees: number[];
}
