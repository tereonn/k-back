import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { NotPermitted, TeamNameAlreadyUsed } from '../src/errors/error_codes';
import { predefinedUsers } from './mock/users';
import { User, Team } from '@prisma/client';

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
  let users: User[];
  let team: Team;

  beforeAll(async () => {
    prisma = new PrismaClient();
    users = await prisma.$transaction(
      predefinedUsers.map((u) => prisma.user.create({ data: u })),
    );
    team = await prisma.team.create({
      data: {
        name: predefinedTeam.name,
        TeamOnUser: {
          create: [
            {
              member: {
                create: {
                  login: predefinedTeam.ownerLogin,
                  pass: predefinedTeam.ownerPass,
                },
              },
              owner: true,
            },
            ...users.slice(1, 3).map((u) => ({
              owner: false,
              member: {
                connect: {
                  id: u.id,
                },
              },
            })),
          ],
        },
      },
    });
  });

  afterAll(async () => {
    const delUsTmRel = prisma.teamOnUser.deleteMany();
    const delUsers = prisma.user.deleteMany();
    const delTeams = prisma.team.deleteMany();

    await prisma.$transaction([delUsTmRel, delUsers, delTeams]);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    const mockedUser = users[0];
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
      expect(res.body).toHaveProperty('success');
      expect(res.body.success).toBeTruthy();
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
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).not.toBeNull();
    });
  });

  describe('PUT team modifying', () => {
    const oldName = 'testTeam';
    const newName = oldName + '2';
    it('Should change team name if user is owner', async () => {
      const res = await request(app.getHttpServer())
        .put(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          newName,
          oldName,
        });

      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data.name).toEqual(newName);
    });

    it('Should return 403 status if user tries to change not owned team', async () => {
      token = (
        await request(app.getHttpServer()).get('/api/login').query({
          login: users[1].login,
          pass: users[1].pass,
        })
      ).body.token;

      const res = await request(app.getHttpServer())
        .put(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({ newName: 'newName2', oldName: newName });

      expect(res.status).toEqual(HttpStatus.FORBIDDEN);
      expect(res.body.msg).toBe(NotPermitted.text);
      expect(res.body.code).toBe(NotPermitted.code);
    });

    describe('(/join) add user to the team', () => {
      it('Should add user to the team', async () => {
        token = (
          await request(app.getHttpServer()).get('/api/login').query({
            login: users[3].login,
            pass: users[3].pass,
          })
        ).body.token;

        const res = await request(app.getHttpServer())
          .put(epPath + '/join')
          .set(`Authorization`, `Bearer ${token}`)
          .query({ name: team.name });

        expect(res.status).toEqual(HttpStatus.OK);
      });

      it('Should return 400 status if a user trying to join already joined team', async () => {
        token = (
          await request(app.getHttpServer()).get('/api/login').query({
            login: users[3].login,
            pass: users[3].pass,
          })
        ).body.token;

        const res = await request(app.getHttpServer())
          .put(epPath + '/join')
          .set(`Authorization`, `Bearer ${token}`)
          .query({ name: team.name });

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    describe('(/remove) remove user from the team', () => {
      const path = epPath + '/remove';
      it('Should remove user from the team if all correct', async () => {
        const res = await request(app.getHttpServer())
          .put(path)
          .set(`Authorization`, `Bearer ${token}`)
          .query({ userId: users[1].id, teamName: team.name });

        expect(res.status).toEqual(HttpStatus.OK);
      });

      it('Should return 403 if user trying remove user from team that user doesnt own', async () => {
        token = (
          await request(app.getHttpServer()).get('/api/login').query({
            login: users[1].login,
            pass: users[1].pass,
          })
        ).body.token;

        const res = await request(app.getHttpServer())
          .put(path)
          .set(`Authorization`, `Bearer ${token}`)
          .query({ userId: users[2].id, teamName: team.name });

        expect(res.status).toEqual(HttpStatus.FORBIDDEN);
      });
    });
  });
});
