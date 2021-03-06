import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataObjectModule } from '../data-object/data-object.module';
import { TeamController } from './team/team.controller';
import { AuthModule } from '../auth/auth.module';
import { UserRaceService } from './user-race/user-race.service';
import { JwtDecodeMiddleware } from '../auth/jwt-decode.middleware';
import { CarController } from './car/car.controller';

@Module({
  imports: [DataObjectModule, AuthModule],
  controllers: [TeamController, CarController],
  providers: [UserRaceService],
})
export class RaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(JwtDecodeMiddleware)
      .forRoutes(TeamController, CarController);
  }
}
