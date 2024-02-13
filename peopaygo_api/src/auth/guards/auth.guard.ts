import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import UserService from 'src/users/user.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    // Check if it's public
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    // Get headers token
    const token = req.headers['access_token'];

    if (!token || Array.isArray(token)) throw new UnauthorizedException('Invalid token...');

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') throw new UnauthorizedException(manageToken);

    if (manageToken.isExpired) throw new UnauthorizedException('Token is expired...');

    const { sub } = manageToken;

    const user = await this.userService.findUserById(parseInt(sub));
    console.log(user);

    if (!user) throw new UnauthorizedException('Invalid user...');

    // New fields were injected in the request on type folder, so we have access to them from anywhere 
    req.idUser = user.id;
    req.roleUser = user.role;

    return true;
  }
}
