import { Injectable } from '@nestjs/common';
import { CarDao, CarData } from '../data/car';
import { PrismaService } from '../prisma.service';
import { Car, User, Prisma } from '@prisma/client';
import { UserDao } from '../data/user';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async createCar(carData: CarData): Promise<Car> {
    const car = CarDao.fromData(carData);
    const createQuery = car.makeCreateOneQuery();

    return this.prisma.car.create(createQuery);
  }

  async getCarsByUser(uid: number) {
    return this.prisma.user.findUnique(UserDao.makeGetUserCarsQuery(uid));
  }

  async getCarById(id: number): Promise<CarDao> {
    const car = await this.prisma.car.findUnique(CarDao.makeGetByUdQuery(id));

    return CarDao.fromPrismaCar(car);
  }

  async changeCarData(c: CarDao) {
    return this.prisma.car.update(c.makeUpdateQuery());
  }
}
