import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { matchUserRoles } from './helpers';
import { ROLES_META_NAME } from './role.decorator';
import { TokenPayload, UserRoles } from './types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRoles[]>(
      ROLES_META_NAME,
      context.getHandler(),
    );
    if (requiredRoles.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest<TokenPayload>().user;

    return matchUserRoles(requiredRoles, user.roles);
  }
}
