import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient, User } from '@prisma/client';
import { predefinedUsers } from './mock';
import { createUsers } from './helpers';
import { UserRoles } from 'src/auth/types';

const baseApiUrl = '/api/season';
const testSeason = {
  year: 2000,
};

describe(`e2e - Season (${baseApiUrl})`, () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let userAdmin: User;
  let userNonAdmin: User;
  let token: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    // data init
    [userAdmin, userNonAdmin] = await createUsers(
      [
        { ...predefinedUsers[0], roles: [UserRoles.Admin] },
        { ...predefinedUsers[1], roles: [UserRoles.User] },
      ],
      prisma,
    );
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
        .query({ login: userAdmin.login, pass: userAdmin.pass })
    ).body.token;
  });

  // This routes can use only users with admin role.

  describe('POST - create season', () => {
    it('Should create a new season', async () => {
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

    it('Should return FORBIDDEN(403) status if creator is not the admin', async () => {
      token = (
        await request(app.getHttpServer())
          .get('/api/login')
          .query({ login: userNonAdmin.login, pass: userNonAdmin.pass })
      ).body.token;

      const year = testSeason.year + 10;
      const res = await request(app.getHttpServer()).post(baseApiUrl).send({
        year,
      });

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('GET - read seasons', () => {
    it('Should return all seasons with the season stages', async () => {
      const res = await request(app.getHttpServer()).get(baseApiUrl);

      expect(res.status).toBe(HttpStatus.OK);
    });
  });

  describe('PUT - change season data', () => {
    it('Should change data if the user is the admin', async () => {
      return false;
    });

    it('Should return FORBIDDEN(403) status if the user is not the admin', () => {
      return false;
    });
  });

  describe(`Stages - ${baseApiUrl}/stage`, () => {
    describe('POST - create stage', () => {
      it('Should create the stage and connect it with the season if user admin', () => {
        return false;
      });

      it('Should return FORBIDDEN(403) if the user is not the admin', () => {
        return false;
      });
    });

    describe('PUT - change stage', () => {
      it('Should change stage data', () => {
        return false;
      });

      it('Should return FORBIDDEN(403) if the user is not the admin', () => {
        return false;
      });
    });

    describe('DELETE - delete stage', () => {
      it('Should delete stage if it is in the pending status', () => {
        return false;
      });

      it('Should return 403 if user is not admin', () => {
        return false;
      });

      it('Should return 400 if stage is not in pending status', () => {
        return false;
      });
    });

    describe(`Entry - ${baseApiUrl}/stage/entry`, () => {
      describe('POST - create entry', () => {
        it('Should create the entry', () => {
          return false;
        });
        it('Should return 400 if user already send application', () => {
          return false;
        });
      });

      describe('GET - get entry info', () => {
        it('Should return all entries of the season if user is admin', () => {
          return false;
        });
        it('Should return 403 if user is not admin', () => {
          return false;
        });
        describe(`User entry - ${baseApiUrl}/stage/entry/user`, () => {
          it('Should return all user stage applications', () => {
            return false;
          });
          it('Should return 403 if user tries read applications of the another user', () => {
            return false;
          });
        });
      });

      describe('PUT - change entry info', () => {
        it('Should change enty status if user is admin', () => {
          return false;
        });
        it('Should return 403 if user is not admin', () => {
          true;
        });
        describe(`Cancel entry - ${baseApiUrl}/stage/entry/cancel`, () => {
          it('Should cancell user entry if user is creator of request or user is admin', () => {
            return false;
          });
          it('Should return 403 if user tries cancel application of the another user', () => {
            return false;
          });
        });
      });
    });
  });
});
