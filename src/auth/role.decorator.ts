import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './types';

export const ROLES_META_NAME = 'roles';

export const RequiredRoles = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_META_NAME, roles);
