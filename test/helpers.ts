import { PrismaClient, User } from '@prisma/client';

type UserData = {
  login: string;
  pass: string;
  roles: string[];
};

export function createUsers(
  users: UserData[],
  p: PrismaClient,
): Promise<User[]> {
  return p.$transaction(
    users.map((u) =>
      p.user.create({
        data: {
          login: u.login,
          pass: u.pass,
          roles: {
            connect: u.roles.map((r) => ({ code: r })),
          },
        },
      }),
    ),
  );
}
