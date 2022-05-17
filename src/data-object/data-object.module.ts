import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class DataObjectModule {}
