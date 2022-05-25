import { Injectable } from '@nestjs/common';
import { CarDao, CarData } from '../data/car';
import { PrismaService } from '../prisma.service';
import { Car as PrismaCar } from '@prisma/client';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async createCar(carData: CarData): Promise<PrismaCar> {
    const car = CarDao.fromData(carData);
    const createQuery = car.getCreateOne();

    return this.prisma.car.create(createQuery);
  }
}
