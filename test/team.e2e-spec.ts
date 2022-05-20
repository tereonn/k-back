import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { TeamNameAlreadyUsed } from '../src/errors/error_codes';

describe('e2e - Team (POST /api/team)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const epPath = '/api/team';

  const mockedUser = {
    login: 'login@login.login',
    pass: '12345678',
  };
  let token: string = '';

  beforeAll(async () => {
    prisma = new PrismaClient();

    await prisma.user.create({ data: mockedUser });
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

    token = (
      await request(app.getHttpServer())
        .get('/api/login')
        .query({ login: mockedUser.login, pass: mockedUser.pass })
    ).body.token;
  });

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
    expect(res.body.User[0].login).toBe(mockedUser.login);
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
