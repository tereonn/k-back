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
  let cars: Car[];

  beforeAll(async () => {
    prisma = new PrismaClient();
    user = await prisma.user.create({
      data: {
        ...mockedUser,
      },
    });

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
  });
});
