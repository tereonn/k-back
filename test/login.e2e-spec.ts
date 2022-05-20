import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as errCodes from '../src/errors/error_codes';
import { PrismaClient } from '@prisma/client';

describe('e2e - Login (GET /api/login)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const endpointPath = '/api/login';
  const epSuccLoginQuery = {
    login: 'test@ttt.tt',
    pass: '1234567',
  };

  beforeAll(async () => {
    prisma = new PrismaClient();

    await prisma.user.create({
      data: epSuccLoginQuery,
    });
  });

  afterAll(async () => {
    const delUser = prisma.user.deleteMany();

    await prisma.$transaction([delUser]);

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('Should return 200 status and token if login and pass are correct', async () => {
    const res = await request(app.getHttpServer())
      .get(endpointPath)
      .query(epSuccLoginQuery);

    expect(res.status).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('Should return 401 if login is incorrect', async () => {
    const req = await request(app.getHttpServer())
      .get(endpointPath)
      .query({ ...epSuccLoginQuery, login: 'bad' + epSuccLoginQuery.login });

    expect(req.status).toEqual(401);
    expect(req.body.msg).toBe(errCodes.BadLoginOrPass.text);
    expect(req.body.code).toBe(errCodes.BadLoginOrPass.code);
  });

  it('Should return 401 and the error if password is incorrect', async () => {
    const req = await request(app.getHttpServer())
      .get(endpointPath)
      .query({ ...epSuccLoginQuery, pass: 'bad' + epSuccLoginQuery.pass });

    expect(req.status).toEqual(401);
    expect(req.body.msg).toBe(errCodes.BadLoginOrPass.text);
    expect(req.body.code).toBe(errCodes.BadLoginOrPass.code);
  });
});
