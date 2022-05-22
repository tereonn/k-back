import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { RaceService } from './race/race.service';
import { CarService } from './car/car.service';

@Module({
  providers: [PrismaService, UserService, RaceService, CarService],
  exports: [UserService, RaceService, CarService],
})
export class DataObjectModule {}
