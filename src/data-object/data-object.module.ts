import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { RaceService } from './race/race.service';
import { CarService } from './car/car.service';
import { SeasonService } from './season/season.service';
import { StageService } from './stage/stage.service';

const exportedProviders = [
  UserService,
  RaceService,
  CarService,
  SeasonService,
  StageService,
];

@Module({
  providers: [PrismaService, ...exportedProviders],
  exports: exportedProviders,
})
export class DataObjectModule {}
