import { Module } from '@nestjs/common';
import { DataObjectModule } from '../data-object/data-object.module';
import { TeamController } from './team/team.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DataObjectModule, AuthModule],
  controllers: [TeamController],
  providers: [],
})
export class RaceModule {}
