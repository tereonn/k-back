import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as errCodes from '../src/consts/error_codes';

describe('e2e - Registration (POST /api/register)', () => {
  let app: INestApplication;
  const reqUserBody = {
    login: 'test',
    pass: '123',
  };
  const epPath = '/api/register';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('Should return 400 if some data is missed', async () => {
    const dataProps = Object.keys(reqUserBody);
    for (const prop of dataProps) {
      const testData = Object.assign({}, reqUserBody);

      delete testData[prop];

      const res = await request(app.getHttpServer())
        .post(epPath)
        .send(testData);

      expect(res.status).toEqual(400);
      expect(res.body.msg).toBe(errCodes.BadPostData.text);
      expect(res.body.code).toBe(errCodes.BadPostData.code);
    }
  });
});
