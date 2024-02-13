import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetController } from './timesheet.controller';
import Timesheet from './entities/timesheet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserService from 'src/users/user.service';
import User from 'src/users/entities/user.entity';
import Employee from 'src/employee/entities/employee.entity';
import EmployeeService from 'src/employee/employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet, User, Employee])],
  controllers: [TimesheetController],
  providers: [TimesheetService, UserService, EmployeeService]
})
export class TimesheetModule { }
