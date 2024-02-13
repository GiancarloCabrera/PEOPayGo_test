import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Employee from "./entities/employee.entity";
import EmployeeService from "./employee.service";
import EmployeeController from "./employee.controller";
import UserService from "src/users/user.service";
import User from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService, UserService],
  exports: [EmployeeService]
})
export default class EmployeeModule { }