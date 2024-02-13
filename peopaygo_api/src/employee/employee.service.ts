import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Employee from './entities/employee.entity';
import CreateEmployeeDto from './dto/create-employee.dto';
import UserService from 'src/users/user.service';
import EditEmployeeDto from './dto/edit-employee.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { calculatePayRate } from 'src/utils/calculate-pay-rate';
import { PAY_TYPES } from 'src/constants/pay_types';

@Injectable()
export default class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private userService: UserService,
  ) { }

  public async createEmployee(employee: CreateEmployeeDto): Promise<Employee> {
    try {
      if (employee.payType === PAY_TYPES.HOURLY && !employee.hours) {
        throw new ErrorManager({ type: 'BAD_REQUEST', msg: `Worked hours were not provided...` });
      }

      if (employee.payType === PAY_TYPES.SALARY) employee.hours = null;

      const foundUser = await this.userService.findUserById(employee.companyId);
      const newEmployee = new Employee();

      Object.assign(newEmployee, employee);
      newEmployee.company = foundUser;
      newEmployee.payRate = calculatePayRate(employee.payType, employee.hours);

      return await this.employeeRepository.save(newEmployee);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteEmployee(id: number): Promise<Employee> {
    try {
      const foundEmployee = await this.getEmployeeById(id);

      return await this.employeeRepository.remove(foundEmployee);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async editEmployee(id: number, employee: EditEmployeeDto): Promise<Employee> {
    try {
      if (employee.payType === PAY_TYPES.HOURLY && !employee.hours) {
        throw new ErrorManager({ type: 'BAD_REQUEST', msg: `Worked hours were not provided...` });
      }

      if (employee.payType === PAY_TYPES.SALARY) employee.hours = null;

      const foundEmployee = await this.getEmployeeById(id);
      Object.assign(foundEmployee, employee)

      if (employee.payType) foundEmployee.payRate = calculatePayRate(employee.payType, employee.hours);

      return await this.employeeRepository.save(foundEmployee);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);

    }
  }

  public async getEmployeesList(page: number, limit: number, clientId: number): Promise<Object> {
    try {
      const skip = (page - 1) * limit;
      const [employees, total] = await this.employeeRepository.findAndCount({
        skip,
        take: limit,
        where: { company: { id: clientId } }
      });

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;

      return {
        employees,
        total,
        page,
        totalPages,
        hasNextPage
      };
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getEmployeeById(id: number): Promise<Employee> {
    try {
      const foundEmployee = await this.employeeRepository.findOne({
        relations: {
          company: true,
        },
        where: {
          id,
        },
      });

      if (!foundEmployee) throw new ErrorManager({ type: 'NOT_FOUND', msg: ` Employee with id ${id} was not found...` });

      return foundEmployee;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
