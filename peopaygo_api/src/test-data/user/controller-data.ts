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

export const saveUserController: User = {
  email: "new22@gmail.com",
  password: "new98278262",
  role: ROLES.CLIENT,
  company: "Amazon",
  id: 122,
  createdAt: expect.any(Object),
  updated_at: expect.any(Object),
  timesheets: expect.any(Object),
  employees: expect.any(Object)
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
  role: ROLES.ADMIN,
  company: 'Facebook'
}

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
  role: editUserTestData.role,
  company: editUserTestData.company,
  updatedAt: new Date("2022-01-01"),
  createdAt: new Date("2022-01-01")
};

export const updatedUserController = {
  ...existingUserController,
  role: editUserTestData.role,
  company: editUserTestData.company,
  updated_at: new Date("2022-01-01"),
  createdAt: new Date("2022-01-01")
};