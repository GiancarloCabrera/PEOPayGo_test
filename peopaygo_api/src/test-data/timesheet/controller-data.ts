import { PAY_TYPES } from "src/constants/pay_types";
import { ROLES } from "src/constants/roles";
import { TIMESHEET_STATUS } from "src/constants/timesheet-status";
import Employee from "src/employee/entities/employee.entity";
import { CreateTimesheetDto } from "src/timesheet/dto/create-timesheet.dto";
import { EditTimesheetDto } from "src/timesheet/dto/edit-timesheet.dto";
import Timesheet from "src/timesheet/entities/timesheet.entity";
import User from "src/users/entities/user.entity";

export const userFound: User = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 122,
  createdAt: new Date(),
  updated_at: new Date(),
  timesheets: [],
  employees: []
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

export const createTimesheet: CreateTimesheetDto = {
  userId: 122,
  startDate: new Date(),
  endDate: new Date(),
  checkDate: new Date(),
  employees: [
    2
  ]
}

export const saveTimesheet: Timesheet = {
  ...createTimesheet,
  id: 4,
  totalGrossPay: 480,
  status: TIMESHEET_STATUS.PENDING,
  notes: null,
  createdAt: new Date(),
  updated_at: new Date(),
  user: userFound,
  employees: [
    employeeFound
  ]
}

export const expectedTimesheet: Timesheet = {
  id: 4,
  totalGrossPay: 480,
  status: TIMESHEET_STATUS.PENDING,
  notes: null,
  startDate: expect.any(String),
  endDate: expect.any(String),
  checkDate: expect.any(String),
  createdAt: expect.any(String),
  updated_at: expect.any(String),
  user: userFound,
  employees: [
    employeeFound
  ]
}

export const editTimesheet: EditTimesheetDto = {
  startDate: new Date(),

  endDate: new Date(),
  checkDate: new Date(),

  employees: [3, 4],
}

export const expectedTimesheetEdit: Timesheet = {
  id: 4,
  totalGrossPay: 480,
  status: TIMESHEET_STATUS.PENDING,
  notes: null,
  startDate: expect.any(String),
  endDate: expect.any(String),
  checkDate: expect.any(String),
  createdAt: expect.any(String),
  updated_at: expect.any(String),
  user: userFound,
  employees: [
    {
      id: 3,
      name: 'Carlo Parra',
      payType: PAY_TYPES.SALARY,
      payRate: 480,
      hours: null,
      company: userFound,
      createdAt: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: 'Said Salcedo',
      payType: PAY_TYPES.SALARY,
      payRate: 480,
      hours: null,
      company: userFound,
      createdAt: new Date(),
      updated_at: new Date(),
    }
  ]
}

export const userNotFound = {
  status: 404,
  message: ' Timesheet with id 4 was not found...'
}

const timesheets: Timesheet[] = [
  {
    ...createTimesheet,
    id: 4,
    totalGrossPay: 480,
    status: TIMESHEET_STATUS.PENDING,
    notes: null,
    createdAt: new Date(),
    updated_at: new Date(),
    user: userFound,
    employees: [
      employeeFound
    ]
  },
  {
    ...createTimesheet,
    id: 6,
    totalGrossPay: 480,
    status: TIMESHEET_STATUS.PENDING,
    notes: null,
    createdAt: new Date(),
    updated_at: new Date(),
    user: userFound,
    employees: [
      employeeFound
    ]
  }
];

const total: number = 10;

export const expectedFindAndCountList: [Timesheet[], number] = [timesheets, total];

export const expectedTimesheetsList = {
  foundTimesheets: [
    {
      userId: 122,
      startDate: expect.any(String || Date),
      endDate: expect.any(String || Date),
      checkDate: expect.any(String || Date),
      id: 4,
      totalGrossPay: 480,
      status: 'PENDING',
      notes: null,
      createdAt: expect.any(String || Date),
      updated_at: expect.any(String || Date),
      user: {
        email: "new22@gmail.com",
        password: "new98278262",
        role: ROLES.CLIENT,
        company: "Amazon",
        id: 122,
        createdAt: expect.any(String || Date),
        updated_at: expect.any(String || Date),
        timesheets: [],
        employees: []
      },
      employees: [
        {
          id: 2,
          name: 'Juan Daniel',
          payType: PAY_TYPES.SALARY,
          payRate: 480,
          hours: null,
          company: {
            email: "new22@gmail.com",
            password: "new98278262",
            role: ROLES.CLIENT,
            company: "Amazon",
            id: 122,
            createdAt: expect.any(String || Date),
            updated_at: expect.any(String || Date),
            timesheets: [],
            employees: []
          },
          createdAt: expect.any(String || Date),
          updated_at: expect.any(String || Date),
        }
      ]
    },
    {
      userId: 122,
      startDate: expect.any(String || Date),
      endDate: expect.any(String || Date),
      checkDate: expect.any(String || Date),
      id: 6,
      totalGrossPay: 480,
      status: 'PENDING',
      notes: null,
      createdAt: expect.any(String || Date),
      updated_at: expect.any(String || Date),
      user: {
        email: "new22@gmail.com",
        password: "new98278262",
        role: ROLES.CLIENT,
        company: "Amazon",
        id: 122,
        createdAt: expect.any(String || Date),
        updated_at: expect.any(String || Date),
        timesheets: [],
        employees: []
      },
      employees: [
        {
          id: 2,
          name: 'Juan Daniel',
          payType: PAY_TYPES.SALARY,
          payRate: 480,
          hours: null,
          company: {
            email: "new22@gmail.com",
            password: "new98278262",
            role: ROLES.CLIENT,
            company: "Amazon",
            id: 122,
            createdAt: expect.any(String || Date),
            updated_at: expect.any(String || Date),
            timesheets: [],
            employees: []
          },
          createdAt: expect.any(String || Date),
          updated_at: expect.any(String || Date),
        }
      ]
    }
  ],
  total: 10,
  page: 1,
  totalPages: 1,
  hasNextPage: false
}