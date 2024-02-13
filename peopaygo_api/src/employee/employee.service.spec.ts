import { Test, TestingModule } from '@nestjs/testing';
import EmployeeService from './employee.service';
import { Repository } from 'typeorm';
import Employee from './entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserService from 'src/users/user.service';
import User from 'src/users/entities/user.entity';
import {
  createEmployeeDataWithHourly,
  createEmployeeDataWithHourlyWithoutHours,
  createEmployeeDataWithSalary,
  deleteEmployeeExpectedResult,
  editEmployeeData,
  editEmployeeDataWithoutHours,
  employeeEntityCreateWithHourly,
  employeeEntityCreateWithSalary,
  employeeFound,
  employeeNotFoundError,
  employeeToBeSaved,
  expectedEmployeesList,
  expectedFindAndCountList,
  hoursNotProvidedError,
  userFoundRelatedToEmployee
} from 'src/test-data/employee/service-data';
import { HttpException } from '@nestjs/common';


describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let userRepository: Repository<User>;
  let employeeRepository: Repository<Employee>;
  let employeeRepositoryToken: string | Function = getRepositoryToken(Employee);
  let userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        UserService,
        {
          provide: employeeRepositoryToken,
          useClass: Repository
        },
        {
          provide: userRepositoryToken,
          useClass: Repository
        }
      ]
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
    employeeRepository = module.get<Repository<Employee>>(employeeRepositoryToken);
    userRepository = module.get<Repository<User>>(userRepositoryToken);

  });

  it('should be defined', () => {
    expect(employeeService).toBeDefined();
  });

  describe('CreateEmployee', () => {
    it('should create employee with salary', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFoundRelatedToEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeEntityCreateWithSalary);

      const result = await employeeService.createEmployee(createEmployeeDataWithSalary);

      expect(result).toEqual(employeeEntityCreateWithSalary);
    });

    it('should create employee with hourly', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFoundRelatedToEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeEntityCreateWithHourly);

      const result = await employeeService.createEmployee(createEmployeeDataWithHourly);

      expect(result).toEqual(employeeEntityCreateWithHourly);
    });

    it('should calculate pay rate based on hours', async () => {
      const expectedPayRate = createEmployeeDataWithHourly.hours * 12;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFoundRelatedToEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeEntityCreateWithHourly);

      const result = await employeeService.createEmployee(createEmployeeDataWithHourly);

      expect(result.payRate).toBe(expectedPayRate);
    });

    it('should calculate pay rate based on salary', async () => {
      const expectedPayRate = 480;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFoundRelatedToEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeEntityCreateWithSalary);

      const result = await employeeService.createEmployee(createEmployeeDataWithSalary);

      expect(result.payRate).toBe(expectedPayRate);
    });

    it('should not create employee with hourly, error hours not provided', async () => {
      try {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userFoundRelatedToEmployee);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeEntityCreateWithHourly);

        await employeeService.createEmployee(createEmployeeDataWithHourlyWithoutHours);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(hoursNotProvidedError.status);
        expect(error.message).toBe(hoursNotProvidedError.message);
      }
    });
  })

  describe('EditEmployee', () => {
    it('should edit an employee', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
      jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeToBeSaved);
      const res = await employeeService.editEmployee(2, editEmployeeData);
      expect(res).toEqual(employeeToBeSaved);
    })

    it('should return error employee not found', async () => {
      try {
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeToBeSaved);
        await employeeService.editEmployee(2, editEmployeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(employeeNotFoundError.status);
        expect(error.message).toBe(employeeNotFoundError.message);
      }
    })

    it('should return error hours not provided', async () => {
      try {
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
        jest.spyOn(employeeRepository, 'save').mockResolvedValueOnce(employeeToBeSaved);

        await employeeService.editEmployee(2, editEmployeeDataWithoutHours);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(hoursNotProvidedError.status);
        expect(error.message).toBe(hoursNotProvidedError.message);
      }
    });
  })
  describe('DeleteEmployee', () => {
    it('should delete employee', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);
      jest.spyOn(employeeRepository, 'remove').mockResolvedValueOnce(deleteEmployeeExpectedResult);

      const res = await employeeService.deleteEmployee(2);
      expect(res).toEqual(deleteEmployeeExpectedResult);
    })

    it('should return error user not found', async () => {
      try {
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(employeeRepository, 'remove').mockResolvedValueOnce(deleteEmployeeExpectedResult);

        await employeeService.deleteEmployee(2);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(employeeNotFoundError.status);
        expect(error.message).toBe(employeeNotFoundError.message);
      }
    })
  })

  describe('Get one or many employees', () => {
    it('Should return an employee', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employeeFound);

      const res = await employeeService.getEmployeeById(2);
      expect(res).toEqual(employeeFound);
    })
    it('Should return employee not foun error', async () => {
      try {
        jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(undefined);

        const res = await employeeService.getEmployeeById(2);
        expect(res).toEqual(employeeFound);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(employeeNotFoundError.status);
        expect(error.message).toBe(employeeNotFoundError.message);
      }
    })

    it('Should return a list of employees', async () => {
      jest.spyOn(employeeRepository, 'findAndCount').mockResolvedValueOnce(expectedFindAndCountList);

      const res = await employeeService.getEmployeesList(1, 10, 2);
      expect(res).toEqual(expectedEmployeesList);
    })
  })

});
