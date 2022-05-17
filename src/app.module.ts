import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DataObjectModule } from './data-object/data-object.module';

@Module({
  imports: [
    AuthModule,
    DataObjectModule,
    RouterModule.register([
      {
        path: 'api',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
