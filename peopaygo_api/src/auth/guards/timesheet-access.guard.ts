import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import { TimesheetService } from 'src/timesheet/timesheet.service';
import UserService from 'src/users/user.service';

@Injectable()
export class TimesheetAccessGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly timesheetService: TimesheetService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    // Check if it's public
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const handler = context.getHandler();
    const req = context.switchToHttp().getRequest<Request>();
    const { idUser } = req;

    if (handler.name === 'createTimesheet') {
      const { userId } = req.body;
      const client = await this.userService.findUserById(userId);

      if (idUser !== client.id) throw new UnauthorizedException('Unauthorized action...');
      return true;
    } if (handler.name === 'getTimesheetListByClientId') {
      const { clientId } = req.params;

      if (idUser !== parseInt(clientId)) throw new UnauthorizedException('Unauthorized action...');

      return true;
    }
    else {
      // Delete & Edit timesheet
      const { id } = req.params;
      const timesheet = await this.timesheetService.getTimesheetById(parseInt(id));

      if (idUser !== timesheet.user.id) throw new UnauthorizedException('Unauthorized action...');
      return true;
    }
  }
}