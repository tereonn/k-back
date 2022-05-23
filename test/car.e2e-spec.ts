import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User, Car } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { predefinedUsers } from './mock/users';
import request from 'supertest';

describe('e2e - Car (/api/car)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const epPath = '/api/car';
  let token = '';
  const mockedUser = predefinedUsers[0];
  const mockCars = [
    {
      name: 'testCar',
      model: 'testModel',
      number: '1dd232 1566f',
      color: 'testColor',
    },
    {
      name: 'testCar2',
      model: 'testModel',
      number: '1dd232 1566f',
      color: 'testColor',
    },
    {
      name: 'testCar3',
      model: 'testModel',
      number: '1dd232 1566f',
      color: 'testColor',
    },
    {
      name: 'testCar4',
      model: 'testModel',
      number: '1dd232 1566f',
      color: 'testColor',
    },
  ];
  let user: User;
  let userWithoutCars: User;
  let cars: Car[];

  beforeAll(async () => {
    prisma = new PrismaClient();
    [user, userWithoutCars] = await prisma.$transaction([
      prisma.user.create({ data: mockedUser }),
      prisma.user.create({ data: predefinedUsers[0] }),
    ]);

    cars = await prisma.$transaction(
      mockCars.slice(1).map((c) =>
        prisma.car.create({
          data: { ...c, User: { connect: { id: user.id } } },
        }),
      ),
    );
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();

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

  describe('POST - add car', () => {
    it('Should add a car to the user', async () => {
      const res = await request(app.getHttpServer())
        .post(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          ...mockCars[0],
        });

      expect(res.status).toEqual(HttpStatus.CREATED);
    });
  });

  describe('GET - read cars', () => {
    it('Should return user cars', async () => {
      const res = await request(app.getHttpServer())
        .get(epPath)
        .set(`Authorization`, `Bearer ${token}`);

      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty('cars');
      expect(res.body.cars).toHaveLength(3);
    });

    it('(/list) - Should return all cars with user data', async () => {
      const requiredProps = ['name', 'model', 'color', 'id', 'number', 'User'];
      const res = await request(app.getHttpServer())
        .get(epPath + '/list')
        .set(`Authorization`, `Bearer ${token}`);

      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty(cars);
      for (const c of res.body.cars) {
        for (const p of requiredProps) {
          expect(c).toHaveProperty(p);
        }
      }
    });
  });

  describe('PUT - change car data', () => {
    it('should change user data', async () => {
      const name = 'changedName';
      const number = 'changed 123 num';
      const res = await request(app.getHttpServer())
        .put(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .send({
          id: cars[0].id,
          data: { name, number },
        });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toMatchObject({
        ...cars[0],
        name,
        number,
      });
    });
  });

  describe('DELETE - delete car', () => {
    it('Should remove car', async () => {
      const res = await request(app.getHttpServer())
        .delete(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .query({ id: cars[0].id });

      expect(res.status).toEqual(HttpStatus.OK);
    });

    it('Should return an error if user is not the car owner', async () => {
      token = (
        await request(app.getHttpServer())
          .get('/api/login')
          .query({ login: userWithoutCars.login, pass: userWithoutCars.pass })
      ).body.token;

      const res = await request(app.getHttpServer())
        .delete(epPath)
        .set(`Authorization`, `Bearer ${token}`)
        .query({ id: cars[0].id });

      expect(res.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
