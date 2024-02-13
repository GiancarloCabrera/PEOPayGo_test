import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Timesheet from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import EmployeeService from 'src/employee/employee.service';
import { TIMESHEET_STATUS } from 'src/constants/timesheet-status';
import UserService from 'src/users/user.service';
import { EditTimesheetDto } from './dto/edit-timesheet.dto';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>,
    private employeeService: EmployeeService,
    private userService: UserService,
  ) { }


  public async createTimesheet(timesheet: CreateTimesheetDto): Promise<Timesheet> {
    try {
      const newTimesheet = new Timesheet();
      Object.assign(newTimesheet, timesheet);
      newTimesheet.status = TIMESHEET_STATUS.PENDING;

      // Get user an stablish the relation
      const foundUser = await this.userService.findUserById(timesheet.userId);
      newTimesheet.user = foundUser;

      // Check if employees exist
      if (timesheet.employees) {
        let total = 0;
        const employeePromises = timesheet.employees.map(async id => {
          const employee = await this.employeeService.getEmployeeById(id);
          total += +employee.payRate;
          return employee
        })

        // Wait for all promises to be solved
        const employees = await Promise.all(employeePromises);

        // Check found users
        employees.forEach(employee => {
          if (!employee) {
            throw new ErrorManager({ type: 'NOT_FOUND', msg: `Employee not found` });
          }
        });
        newTimesheet.totalGrossPay = total;
        newTimesheet.employees = employees
      } else {
        newTimesheet.totalGrossPay = 0;
      }

      return await this.timesheetRepository.save(newTimesheet);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async editTimesheet(id: number, timesheet: EditTimesheetDto) {
    try {
      const foundTimesheet = await this.getTimesheetById(id);
      Object.assign(foundTimesheet, timesheet);

      if (timesheet.employees) {
        let total = 0;
        const employeePromises = timesheet.employees.map(async id => {
          const employee = await this.employeeService.getEmployeeById(id);
          total += +employee.payRate;
          return employee;
        })

        // Wait for all promises to be solved
        const employees = await Promise.all(employeePromises);

        // Check found users
        employees.forEach(employee => {
          if (!employee) {
            throw new ErrorManager({ type: 'NOT_FOUND', msg: `Employee not found` });
          }
        });
        foundTimesheet.totalGrossPay = total;
        foundTimesheet.employees = employees;
      }

      return await this.timesheetRepository.save(foundTimesheet);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);

    }
  }

  public async getTimesheetById(id: number) {
    try {
      const foundTimesheet = await this.timesheetRepository.findOne({
        relations: {
          user: true,
          employees: true
        },
        where: {
          id,
        },
      });

      if (!foundTimesheet) throw new ErrorManager({ type: 'NOT_FOUND', msg: ` Timesheet with id ${id} was not found...` });

      return foundTimesheet;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);

    }
  }

  public async getTimesheetListByClientId(page: number, limit: number, clientId: number) {
    try {
      const skip = (page - 1) * limit;
      const [foundTimesheets, total] = await this.timesheetRepository.findAndCount({
        skip,
        take: limit,
        relations: {
          user: true
          // employees: true
        },
        where: {
          user: {
            id: clientId
          }
        },
      });

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;

      return {
        foundTimesheets,
        total,
        page,
        totalPages,
        hasNextPage
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);

    }
  }
}
