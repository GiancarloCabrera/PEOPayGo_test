import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetController } from './timesheet.controller';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import Timesheet from './entities/timesheet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimesheetService } from './timesheet.service';
import User from 'src/users/entities/user.entity';
import { TimesheetAccessGuard } from 'src/auth/guards/timesheet-access.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import UserService from 'src/users/user.service';
import Employee from 'src/employee/entities/employee.entity';
import EmployeeService from 'src/employee/employee.service';

describe('TimesheetController', () => {
  let app: INestApplication;
  let timesheetController: TimesheetController;
  let timesheetService: TimesheetService;
  let timesheetRepository: Repository<Timesheet>;
  let timesheetRepositoryToken: string | Function = getRepositoryToken(Timesheet);
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);
  let employeeRepository: Repository<Employee>;
  let employeeRepositoryToken: string | Function = getRepositoryToken(Employee);
  let authGuard: AuthGuard;
  let rolesGuard: RolesGuard;
  let timesheetGuard: TimesheetAccessGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesheetController],
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
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init()
    timesheetController = module.get<TimesheetController>(TimesheetController);
    timesheetService = module.get<TimesheetService>(TimesheetService);
    timesheetRepository = module.get<Repository<Timesheet>>(timesheetRepositoryToken);
    employeeRepository = module.get<Repository<Employee>>(employeeRepositoryToken);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    authGuard = module.get<AuthGuard>(AuthGuard)
    rolesGuard = module.get<RolesGuard>(RolesGuard)
    timesheetGuard = module.get<TimesheetAccessGuard>(TimesheetAccessGuard)

  });

  it('should be defined', () => {
    expect(timesheetController).toBeDefined();
  });
});
