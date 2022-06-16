import { INestApplication } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';

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

export async function getUserAuthToken(
  login: string,
  pass: string,
  app: INestApplication,
): Promise<string> {
  return (
    await request(app.getHttpServer()).get('/api/login').query({ login, pass })
  ).body.token;
}
