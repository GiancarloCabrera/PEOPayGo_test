import { PAY_TYPES } from "src/constants/pay_types"
import { ROLES } from "src/constants/roles"
import CreateEmployeeDto from "src/employee/dto/create-employee.dto"
import EditEmployeeDto from "src/employee/dto/edit-employee.dto"
import Employee from "src/employee/entities/employee.entity"

export const userFound = {
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

export const createEmployee: CreateEmployeeDto = {
  name: 'Juan Daniel',
  payType: PAY_TYPES.SALARY,
  companyId: 2
}

export const saveEmployee: Employee = {
  name: 'Juan Daniel',
  payType: PAY_TYPES.SALARY,
  id: 2,
  payRate: 480,
  hours: null,
  company: userFound,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const editEmployeeData: EditEmployeeDto = {
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
  hours: 20
}


export const editEmployeeDataWithNoHours: EditEmployeeDto = {
  name: 'Francisco',
  payType: PAY_TYPES.HOURLY,
}

export const employeeFound = {
  id: 2,
  name: 'Juan Daniel',
  payType: PAY_TYPES.SALARY,
  payRate: 480,
  hours: null,
  company: userFound,
  createdAt: new Date(),
  updated_at: new Date(),
}

export const saveEditEmployee: Employee = {
  ...editEmployeeData,
  id: 2,
  payRate: 480,
  hours: null,
  company: userFound,
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
      company: {
        email: "new22@gmail.com",
        password: "new98278262",
        role: ROLES.CLIENT,
        company: "Amazon",
        id: 2,
        createdAt: expect.any(String || Date),
        updated_at: expect.any(String || Date),
        timesheets: [],
        employees: []
      },
      createdAt: expect.any(String || Date),
      updated_at: expect.any(String || Date)
    },
    {
      id: 2,
      name: 'Empleado 2',
      payType: 'HOURLY',
      payRate: 20,
      hours: 40,
      company: {
        email: "new22@gmail.com",
        password: "new98278262",
        role: ROLES.CLIENT,
        company: "Amazon",
        id: 2,
        createdAt: expect.any(String || Date),
        updated_at: expect.any(String || Date),
        timesheets: [],
        employees: []
      },
      createdAt: expect.any(String || Date),
      updated_at: expect.any(String || Date)
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
    company: userFound,
    createdAt: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Empleado 2',
    payType: PAY_TYPES.HOURLY,
    payRate: 20,
    hours: 40,
    company: userFound,
    createdAt: new Date(),
    updated_at: new Date(),
  },
];

const total: number = 10;

export const expectedFindAndCountList: [Employee[], number] = [employees, total];

export const employeeNotFoundError = {
  status: 404,
  message: 'NOT_FOUND ::  Employee with id 2 was not found...'
}

export const hoursNotProvidedError = {
  status: 400,
  message: 'BAD_REQUEST :: Worked hours were not provided...'
}