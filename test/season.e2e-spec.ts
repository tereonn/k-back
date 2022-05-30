import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient, User } from '@prisma/client';
import { predefinedUsers } from './mock';

const baseApiUrl = '/api/season';
const testSeason = {
  year: 2000,
};

describe(`e2e - Season (${baseApiUrl})`, () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let defaultAuthUser: User;
  let token: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    // data init
    [defaultAuthUser] = await prisma.$transaction([
      prisma.user.create({ data: predefinedUsers[0] }),
    ]);
  });
  afterAll(async () => {
    //data cleanup
    await prisma.$transaction([prisma.user.deleteMany()]);

    //disconnect
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    token = (
      await request(app.getHttpServer())
        .get('/api/login')
        .query({ login: defaultAuthUser.login, pass: defaultAuthUser.pass })
    ).body.token;
  });

  // This routes can use only users with admin role.

  describe('POST - create season', () => {
    it('Should create new season', async () => {
      const year = testSeason.year + 10;
      const res = await request(app.getHttpServer()).post(baseApiUrl).send({
        year,
      });

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('year');
      expect(res.body).toHaveProperty('id');
      expect(res.body.year).toBe(year);
      expect(res.body.id).toBeGreaterThan(0);
    });
  });
});
