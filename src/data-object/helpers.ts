import { UpdateUserProps } from './data/user';
import { Prisma } from '@prisma/client';

export function userPropsToUpdInput(
  d: UpdateUserProps,
): Prisma.UserUpdateInput {
  const userProps = ['pass'];
  const result: Prisma.UserUpdateInput = {};
  for (const p in d) {
    if (userProps.some((v) => v === p)) {
      result[p] = d[p];
    } else {
      if (!result.hasOwnProperty('UserInfo')) {
        result.UserInfo = { update: {} };
      }

      result.UserInfo.update[p] = d[p];
    }
  }

  return result;
}
