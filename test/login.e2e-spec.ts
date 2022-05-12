import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as errCodes from '../src/consts/error_codes';

describe('e2e - Login (GET /api/login)', () => {
  let app: INestApplication;
  const endpointPath = 'api/login';
  const epSuccLoginQuery = {
    login: 'test',
    pass: 'test',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
      .query({ ...epSuccLoginQuery, login: 'bad' });

    expect(req.status).toEqual(401);
    expect(req.body.msg).toBe(errCodes.BadLoginOrPass.text);
    expect(req.body.code).toBe(errCodes.BadLoginOrPass.code);
  });

  it('Should return 401 and the error if password is incorrect', async () => {
    const req = await request(app.getHttpServer())
      .get(endpointPath)
      .query({ ...epSuccLoginQuery, pass: 'bad' });

    expect(req.status).toEqual(401);
    expect(req.body.msg).toBe(errCodes.BadLoginOrPass.text);
    expect(req.body.code).toBe(errCodes.BadLoginOrPass.code);
  });
});
