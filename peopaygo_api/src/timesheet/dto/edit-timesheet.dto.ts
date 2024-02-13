import { IsDate, ArrayNotEmpty, IsOptional } from 'class-validator';

export class EditTimesheetDto {
  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsDate()
  checkDate: Date;

  @IsOptional()
  @ArrayNotEmpty()
  employees: number[];
}
