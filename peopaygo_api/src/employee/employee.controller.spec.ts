import { Test, TestingModule } from "@nestjs/testing"
import EmployeeController from "./employee.controller";
import EmployeeService from "./employee.service";
import UserService from "src/users/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HttpException, HttpStatus, INestApplication } from "@nestjs/common";
import Employee from "./entities/employee.entity";
import { Repository } from "typeorm";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ManageEmployeeGuard } from "src/auth/guards/mange-employ.guard";
import User from "src/users/entities/user.entity";
import { createEmployee, editEmployeeData, editEmployeeDataWithNoHours, employeeFound, employeeNotFoundError, expectedEmployeesList, expectedFindAndCountList, hoursNotProvidedError, saveEditEmployee, saveEmployee, userFound } from "src/test-data/employee/controller-data";
import * as request from 'supertest';

describe('EmployeeController', () => {
  let app: INestApplication;
  let employeeController: EmployeeController;
  let employeeService: EmployeeService;
  let employeeRepository: Repository<Employee>;
  let employeeRepositoryToken: string | Function = getRepositoryToken(Employee);
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);
  let authGuard: AuthGuard;
  let rolesGuard: RolesGuard;
  let manageEmployeeGuard: ManageEmployeeGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        EmployeeService,
        UserService,
        {
          provide: employeeRepositoryToken,
          useClass: Repository
        },
        {
          provide: userRepositoryToken,
          useClass: Repository,
        }
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init()
    employeeController = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
    employeeRepository = module.get<Repository<Employee>>(employeeRepositoryToken);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    authGuard = module.get<AuthGuard>(AuthGuard)
    rolesGuard = module.get<RolesGuard>(RolesGuard)
    manageEmployeeGuard = module.get<ManageEmployeeGuard>(ManageEmployeeGuard)
  })

  it('Should be defined', () => {
    expect(employeeController).toBeDefined();
  })

  describe('CreateEmployee', () => {
    it('Should create an employee', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFound);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(saveEmployee)

        const response = await request(app.getHttpServer()).post('/employee').send(createEmployee);
        expect(response.body).toEqual(saveEmployee)
      } catch (error) {
        return error;
      }
    })

    it('Should not create an employee, get an error', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFound);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(saveEmployee)

        await request(app.getHttpServer()).post('/employee').send(createEmployee);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    })
  })

  describe('EditEmployee', () => {
    it('Should edit an employee', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(saveEditEmployee)

        const res = await request(app.getHttpServer()).put('/employee/2').send(editEmployeeData);
        expect(res.status).toBe(200);
        expect(res.body).toBe(saveEditEmployee);
      } catch (error) {
        return error;
      }
    })

    it('Should not edit an employee, get employee not found', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(saveEditEmployee)

        await request(app.getHttpServer()).put('/employee/2').send(editEmployeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(employeeNotFoundError.status);
        expect(error.message).toBe(employeeNotFoundError.message);
      }
    })

    it('should return error hours not provided', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(saveEditEmployee)

        await request(app.getHttpServer()).put('/employee/2').send(editEmployeeDataWithNoHours);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(hoursNotProvidedError.status);
        expect(error.message).toBe(hoursNotProvidedError.message);
      }
    })
  })

  describe('DeleteEmployee', () => {

    it('should delete employee', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
      jest.spyOn(employeeRepository, 'remove').mockResolvedValueOnce(employeeFound);

      const expectedRes = {
        ...employeeFound,
        company: {
          ...employeeFound.company,
          createdAt: new Date(employeeFound.createdAt),
          updated_at: new Date(employeeFound.updated_at)
        },
        createdAt: new Date(employeeFound.createdAt),
        updated_at: new Date(employeeFound.updated_at)
      }

      const response = await request(app.getHttpServer()).delete('/employee/2').send();
      const parsedAns = {
        ...response.body,
        company: {
          ...response.body.company,
          createdAt: new Date(response.body.createdAt),
          updated_at: new Date(response.body.updated_at)
        },
        createdAt: new Date(employeeFound.createdAt),
        updated_at: new Date(employeeFound.updated_at)
      }

      expect(parsedAns).toEqual(expectedRes);
    })

    it('should not delete employee, it was not found...', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(employeeRepository, 'remove').mockResolvedValueOnce(employeeFound);

        await request(app.getHttpServer()).delete('/employee/2').send();

      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(employeeNotFoundError.status);
        expect(error.message).toBe(employeeNotFoundError.message);
      }
    })
  })

  describe('Get one or many employees', () => {
    it('Should return an employee filtered by Id', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
      const expectedRes = {
        ...employeeFound,
        company: {
          ...employeeFound.company,
          createdAt: new Date(employeeFound.createdAt),
          updated_at: new Date(employeeFound.updated_at)
        },
        createdAt: new Date(employeeFound.createdAt),
        updated_at: new Date(employeeFound.updated_at)
      }
      const response = await request(app.getHttpServer()).get('/employee/2').send();;
      const parsedAns = {
        ...response.body,
        company: {
          ...response.body.company,
          createdAt: new Date(response.body.createdAt),
          updated_at: new Date(response.body.updated_at)
        },
        createdAt: new Date(employeeFound.createdAt),
        updated_at: new Date(employeeFound.updated_at)
      }
      expect(response.status).toBe(200);
      expect(expectedRes).toEqual(parsedAns);
    })

    it('Should return a list of employees filtered by client id', async () => {
      const props = {
        clientId: 2,
        limit: 10,
        page: 1
      }
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(employeeRepository, 'findAndCount').mockResolvedValueOnce(expectedFindAndCountList);

      const response = await request(app.getHttpServer()).get(`/employee/list/${props.clientId}?page=${props.page}&limit=${props.limit}`).send();;
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedEmployeesList);
    })

    it('Should return error 400, query params not provided', async () => {
      try {
        const props = {
          clientId: 2,
          limit: null,
          page: null
        }
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(manageEmployeeGuard, 'canActivate').mockResolvedValue(true)
        jest.spyOn(employeeRepository, 'findAndCount').mockResolvedValueOnce(expectedFindAndCountList);

        const response = await request(app.getHttpServer()).get(`/employee/list/${props.clientId}?page=${props.page}&limit=${props.limit}`).send();;
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    })
  })

})