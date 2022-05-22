import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { TeamNameAlreadyUsed } from '../src/errors/error_codes';
import { predefinedUsers } from './mock/users';
describe('e2e - Team (/api/team)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const epPath = '/api/team';

  const predefinedTeam = {
    name: 'testPredTeam',
    ownerLogin: 'teamOwner@test.test',
    ownerPass: '1234567',
  };
  let token: string = '';

  beforeAll(async () => {
    prisma = new PrismaClient();

    // await prisma.user.createMany({ data: predefinedUsers });
    const users = await prisma.$transaction(
      predefinedUsers.map((u) => prisma.user.create({ data: u })),
    );
    await prisma.team.create({
      data: {
        name: predefinedTeam.name,
        User: {
          create: {
            login: predefinedTeam.ownerLogin,
            pass: predefinedTeam.ownerPass,
          },
          connect: users.slice(1, 3).map((u) => ({ id: u.id })),
        },
      },
    });
  });

  afterAll(async () => {
    const delUsers = prisma.user.deleteMany();
    const delTeams = prisma.team.deleteMany();

    await prisma.$transaction([delUsers, delTeams]);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    const mockedUser = predefinedUsers[0];
    token = (
      await request(app.getHttpServer())
        .get('/api/login')
        .query({ login: mockedUser.login, pass: mockedUser.pass })
    ).body.token;
  });

  describe('POST - team creation', () => {
    it('Should succeed on correct data', async () => {
      const res = await request(app.getHttpServer())
        .post(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          team: {
            name: 'testteam',
          },
        });

      expect(res.status).toEqual(201);
      expect(res.body.name).toBe('testteam');
      expect(res.body.User).toHaveLength(1);
      expect(res.body.User[0].login).toBe(predefinedUsers[0].login);
    });

    it('Should return 409 status and error if team name is duplicating', async () => {
      const res = await request(app.getHttpServer())
        .post(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          team: {
            name: 'testteam',
          },
        });

      expect(res.status).toEqual(409);
      expect(res.body.msg).toBe(TeamNameAlreadyUsed.text);
      expect(res.body.code).toBe(TeamNameAlreadyUsed.code);
    });
  });

  describe('GET team reading', () => {
    it('Should return team info with included users', async () => {
      const res = await request(app.getHttpServer())
        .get(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .query({ name: predefinedTeam.name });

      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('User');
      expect(res.body.User).toHaveLength(3);
    });
  });

  describe('PUT team modifying', () => {
    it('Should add user into the team if team members number is less than 3', async () => {
      const res = await request(app.getHttpServer())
        .put(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          userIds: [
            {
              login: predefinedUsers[2].login,
            },
          ],
        });

      expect(res.status).toEqual(HttpStatus.OK);
    });
  });
});
