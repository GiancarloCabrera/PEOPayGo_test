import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import EmployeeService from 'src/employee/employee.service';
import UserService from 'src/users/user.service';

@Injectable()
export class ManageEmployeeGuard implements CanActivate {
  constructor(private readonly employeeService: EmployeeService, private readonly userService: UserService, private readonly reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    // Check if it's public
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const handler = context.getHandler();
    const req = context.switchToHttp().getRequest<Request>();
    console.log(req, 'HANDLER: ', handler.name);

    // Get user logged id
    const loggedUser = req.idUser;

    if (handler.name === 'createEmployee') {
      const { companyId } = req.body;
      const employee = await this.userService.findUserById(parseInt(companyId));

      if (loggedUser !== employee.id) throw new UnauthorizedException('Unauthorized action...');
      return true;
    }
    if (handler.name === 'getEmployeesList') {
      const { clientId } = req.params;
      if (loggedUser !== parseInt(clientId)) throw new UnauthorizedException('Unauthorized action...');

      return true;
    } else {
      // Delete, Update and Get Employee by Id

      // Get id employee to be deleted
      const { id } = req.params;

      // Get idCompany from the employee to be deleted
      const employee = await this.employeeService.getEmployeeById(parseInt(id));

      // Compare
      if (loggedUser !== employee.company.id) throw new UnauthorizedException('Unauthorized action...');

      return true;
    }
  }
}
