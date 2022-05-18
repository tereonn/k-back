import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DataObjectModule } from './data-object/data-object.module';
import { RaceModule } from './race/race.module';

@Module({
  imports: [
    AuthModule,
    RaceModule,
    DataObjectModule,
    RouterModule.register([
      {
        path: 'api',
        module: AuthModule,
      },
      {
        path: 'api',
        module: RaceModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
