import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataObjectModule } from './data-object/data-object.module';

@Module({
  imports: [AuthModule, DataObjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
