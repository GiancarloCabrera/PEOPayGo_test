import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(ROLES_KEY, context.getHandler());

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();

    const { roleUser } = req;

    if (roles === undefined) {
      // If it is not admin, return true
      if (!admin) {
        return true;
      } else if (admin && roleUser === admin) {
        return true;
      } else {
        throw new UnauthorizedException('You do not have permissions...')
      }
    }

    // Check if the role sent by the user exists
    const isAuth = roles.some(role => role === roleUser);

    if (!isAuth) throw new UnauthorizedException('You do not have permissions...');

    return true;
  }
}
