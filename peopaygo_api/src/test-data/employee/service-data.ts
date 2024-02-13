import { PAY_TYPES } from "src/constants/pay_types";
import { ROLES } from "src/constants/roles";
import CreateEmployeeDto from "src/employee/dto/create-employee.dto";
import EditEmployeeDto from "src/employee/dto/edit-employee.dto";
import Employee from "src/employee/entities/employee.entity";

export const userFoundRelatedToEmployee = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 2,
  createdAt: new Date(),
  updated_at: new Date(),
  timesheets: [],
  employees: []
}

export const createEmployeeDataWithSalary: CreateEmployeeDto = {
  name: 'Juan Daniel',
  payType: PAY_TYPES.SALARY,
  companyId: 2
}

export const employeeEntityCreateWithSalary = {
  ...createEmployeeDataWithSalary,
  id: 2,
  payRate: 480,
  hours: null,
  company: userFoundRelatedToEmployee,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const createEmployeeDataWithHourly: CreateEmployeeDto = {
  name: 'Juan Daniel',
  payType: PAY_TYPES.HOURLY,
  hours: 20,
  companyId: 2
}

export const createEmployeeDataWithHourlyWithoutHours: CreateEmployeeDto = {
  name: 'Juan Daniel',
  payType: PAY_TYPES.HOURLY,
  companyId: 2
}

export const employeeEntityCreateWithHourly = {
  ...createEmployeeDataWithHourly,
  id: 2,
  payRate: createEmployeeDataWithHourly.hours * 12,
  hours: createEmployeeDataWithHourly.hours,
  company: userFoundRelatedToEmployee,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const employeeFound = {
  id: 2,
  name: 'Juan Daniel',
  payType: PAY_TYPES.SALARY,
  payRate: 480,
  hours: null,
  company: userFoundRelatedToEmployee,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const editEmployeeData: EditEmployeeDto = {
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
  hours: 20
}

export const editEmployeeDataWithoutHours: EditEmployeeDto = {
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
}

export const employeeToBeSaved = {
  id: 2,
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
  hours: 20,
  payRate: 480,
  company: userFoundRelatedToEmployee,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const deleteEmployeeExpectedResult = {
  id: 2,
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
  hours: 20,
  payRate: 480,
  company: userFoundRelatedToEmployee,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const expectedEmployeesList = {
  employees: [
    {
      id: 1,
      name: 'Empleado 1',
      payType: 'SALARY',
      payRate: 480,
      hours: null,
      company: userFoundRelatedToEmployee,
      createdAt: expect.any(Date),
      updated_at: expect.any(Date)
    },
    {
      id: 2,
      name: 'Empleado 2',
      payType: 'HOURLY',
      payRate: 20,
      hours: 40,
      company: userFoundRelatedToEmployee,
      createdAt: expect.any(Date),
      updated_at: expect.any(Date)
    }
  ],
  total: 10,
  page: 1,
  totalPages: 1,
  hasNextPage: false
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Empleado 1',
    payType: PAY_TYPES.SALARY,
    payRate: 480,
    hours: null,
    company: userFoundRelatedToEmployee,
    createdAt: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Empleado 2',
    payType: PAY_TYPES.HOURLY,
    payRate: 20,
    hours: 40,
    company: userFoundRelatedToEmployee,
    createdAt: new Date(),
    updated_at: new Date(),
  },
];

const total: number = 10;

export const expectedFindAndCountList: [Employee[], number] = [employees, total];

export const hoursNotProvidedError = {
  status: 400,
  message: 'BAD_REQUEST :: Worked hours were not provided...'
}

export const employeeNotFoundError = {
  status: 404,
  message: 'NOT_FOUND ::  Employee with id 2 was not found...'
}