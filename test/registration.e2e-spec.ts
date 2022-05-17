import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as errCodes from '../src/errors/error_codes';

describe('e2e - Registration (POST /api/register)', () => {
  let app: INestApplication;
  const reqUserBody = {
    user: {
      login: 'test@ttt.tt',
      pass: '1234567',
      city: 'tcity',
      phone: '12345',
      name: 'tname',
    },
  };
  const epPath = '/api/register';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('Should succeed on correct data', async () => {
    const res = await request(app.getHttpServer())
      .post(epPath)
      .send(reqUserBody);

    expect(res.status).toEqual(201);
    expect(res.body.token).toBeDefined();
  });

  it('Should return 409 if user already exists', async () => {
    const res = await request(app.getHttpServer())
      .post(epPath)
      .send(reqUserBody);

    expect(res.status).toEqual(409);
    expect(res.body.msg).toBe(errCodes.UserExists.text);
    expect(res.body.code).toBe(errCodes.UserExists.code);
  });
});
