import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { RaceService } from './race/race.service';

@Module({
  providers: [PrismaService, UserService, RaceService],
  exports: [UserService, RaceService],
})
export class DataObjectModule {}
