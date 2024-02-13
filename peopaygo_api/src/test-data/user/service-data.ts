import { ROLES } from "src/constants/roles";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { EditUserDto } from "src/users/dto/edit-user.dto";
import User from "src/users/entities/user.entity";

export const createUserData: CreateUserDto = {
  email: "new2@gmail.com",
  password: "njdoeiu2828",
  role: ROLES.CLIENT,
  company: "Amazon"
}

export const createUserWithoutCompData: CreateUserDto = {
  email: "new2@gmail.com",
  password: "njdoeiu2828",
  role: ROLES.CLIENT
}

export const saveUser: User = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 122,
  createdAt: expect.any(Date),
  updated_at: expect.any(Date),
  timesheets: expect.any(Array),
  employees: expect.any(Array)
}

export const editUserTestData: EditUserDto = {
  password: 'hdus23532ferferf4',
  role: ROLES.ADMIN,
  company: 'Facebook'
}

export const existingUser = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 2,
  createdAt: expect.any(Date),
  updated_at: expect.any(Date),
  timesheets: expect.any(Array),
  employees: expect.any(Array)
};

export const existingUserController = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 2,
  createdAt: new Date("2022-01-01"),
  updated_at: new Date("2022-01-01"),
  timesheets: [],
  employees: []
};

export const updatedUser = {
  ...existingUserController,
  password: editUserTestData.password,
  role: editUserTestData.role,
  company: editUserTestData.company,
  updatedAt: new Date("2022-01-01"),
  createdAt: new Date("2022-01-01")
};

export const updatedUserController = {
  ...existingUserController,
  password: editUserTestData.password,
  role: editUserTestData.role,
  company: editUserTestData.company,
  updated_at: new Date("2022-01-01"),
  createdAt: new Date("2022-01-01")
};

export const editUserAdminTestData: EditUserDto = {
  password: 'hdus23532ferferf4',
  role: ROLES.ADMIN,
  company: 'Facebook'
}

export const existingUserAdmin = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.ADMIN,
  company: "Amazon",
  id: 2,
  createdAt: expect.any(Date),
  updated_at: expect.any(Date),
  timesheets: expect.any(Array),
  employees: expect.any(Array)
};

export const updatedUserAdmin = {
  ...existingUserAdmin,
  password: editUserTestData.password,
  role: editUserTestData.role,
  company: editUserTestData.company,
  updatedAt: new Date(),
  createdAt: new Date()
};

export const userAlreadyExistsError = {
  status: 400,
  message: 'BAD_REQUEST :: User already exists, use another email...'
}

export const clientMustBelToComp = {
  status: 400,
  message: 'BAD_REQUEST :: Clients must belong to a company!'
}

export const userNotFound = {
  status: 404,
  message: 'NOT_FOUND :: User not found...'
}

export const cannotEditAdmin = {
  status: 401,
  message: 'UNAUTHORIZED :: You cannot edit this user...'
}