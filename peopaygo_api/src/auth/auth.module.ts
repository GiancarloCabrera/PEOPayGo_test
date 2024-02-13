import { Global, Module } from "@nestjs/common";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import UserService from "src/users/user.service";
import UserModule from "src/users/user.module";
import EmployeeModule from "src/employee/employee.module";

@Global()
@Module({
  imports: [UserModule, EmployeeModule],
  providers: [AuthService, UserService, EmployeeModule],
  controllers: [AuthController]
})
export default class AuthModule { }