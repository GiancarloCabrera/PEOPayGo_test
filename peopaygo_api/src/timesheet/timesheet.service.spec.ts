import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetService } from './timesheet.service';
import { Repository } from 'typeorm';
import Timesheet from './entities/timesheet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import Employee from 'src/employee/entities/employee.entity';
import UserService from 'src/users/user.service';
import EmployeeService from 'src/employee/employee.service';

describe('TimesheetService', () => {
  let timesheetService: TimesheetService;
  let timesheetRepository: Repository<Timesheet>;
  let timesheetRepositoryToken: string | Function = getRepositoryToken(Timesheet);
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);
  let employeeRepository: Repository<Employee>;
  let employeeRepositoryToken: string | Function = getRepositoryToken(Employee);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimesheetService,
        UserService,
        EmployeeService,
        {
          provide: timesheetRepositoryToken,
          useClass: Repository
        },
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
        {
          provide: employeeRepositoryToken,
          useClass: Repository,
        }
      ],
    }).compile();

    timesheetService = module.get<TimesheetService>(TimesheetService);
    timesheetService = module.get<TimesheetService>(TimesheetService);
    timesheetRepository = module.get<Repository<Timesheet>>(timesheetRepositoryToken);
    employeeRepository = module.get<Repository<Employee>>(employeeRepositoryToken);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(timesheetService).toBeDefined();
  });
});
