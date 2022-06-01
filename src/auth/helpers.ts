import { UserRoles } from './types';

export const matchUserRoles = (a: UserRoles[], b: UserRoles[]): boolean => {
  return a.some((ae) => b.some((be) => ae === be));
};
