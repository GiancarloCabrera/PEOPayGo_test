import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetController } from './timesheet.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
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
import * as request from 'supertest';
import { createTimesheet, editTimesheet, employeeFound, expectedFindAndCountList, expectedTimesheet, expectedTimesheetEdit, expectedTimesheetsList, saveTimesheet, userFound } from 'src/test-data/timesheet/controller-data';
import { userNotFound } from 'src/test-data/user/service-data';


const parseDates = (obj) => {
  obj.createdAt = new Date(obj.createdAt);
  obj.updated_at = new Date(obj.updated_at);
  obj.checkDate = new Date(obj.checkDate);
  obj.endDate = new Date(obj.endDate);
  obj.startDate = new Date(obj.startDate);
  obj.user.createdAt = new Date(obj.user.createdAt);
  obj.user.updated_at = new Date(obj.user.updated_at);
  obj.employees = obj.employees.map((employee) => {
    employee.createdAt = new Date(employee.createdAt);
    employee.updated_at = new Date(employee.updated_at);
    employee.company.createdAt = new Date(employee.company.createdAt);
    employee.company.updated_at = new Date(employee.company.updated_at);
    return employee;
  });
  return obj;
};


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

  describe('Create a timesheet', () => {
    it('should create a timesheet', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFound);
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userFound);
      jest.spyOn(timesheetRepository, 'save').mockResolvedValueOnce(saveTimesheet);
      const res = await request(app.getHttpServer()).post('/timesheet').send(createTimesheet);
      // Parsing strings to date (From db dates come as strings)
      const resParsed = parseDates(res.body)

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(resParsed).toEqual(saveTimesheet);
    });

    it('should not create a timeshet, send an error', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFound);
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userFound);
        jest.spyOn(timesheetRepository, 'save').mockResolvedValueOnce(saveTimesheet);
        await request(app.getHttpServer()).post('/timesheet').send(createTimesheet);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  })

  describe('Get a timesheet', () => {
    it('should get a timesheet', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(timesheetRepository, 'findOne').mockResolvedValueOnce(saveTimesheet);
      const res = await request(app.getHttpServer()).get('/timesheet/4').send();
      const resParsed = parseDates(res.body)

      expect(res.status).toBe(200);
      expect(resParsed).toEqual(saveTimesheet);
    });

    it('should not get a timesheet, send an error', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(timesheetRepository, 'findOne').mockResolvedValueOnce(undefined);
        await request(app.getHttpServer()).get('/timesheet/4').send();

      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should get a timesheet list by client id', async () => {
      const props = {
        clientId: 2,
        limit: 10,
        page: 1
      }
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(timesheetRepository, 'findAndCount').mockResolvedValueOnce(expectedFindAndCountList);

      const res = await request(app.getHttpServer()).get(`/timesheet/list/${props.clientId}?page=${props.page}&limit=${props.limit}`).send();
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedTimesheetsList);
    });

    it('should return error 400 query params not provided', async () => {
      try {

        const props = {
          clientId: 2,
          limit: null,
          page: null
        }
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(timesheetGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(timesheetRepository, 'findAndCount').mockResolvedValueOnce(expectedFindAndCountList);

        await request(app.getHttpServer()).get(`/timesheet/list/${props.clientId}?page=${props.page}&limit=${props.limit}`).send();
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  })
});
