import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';
import { DataObjectModule } from '../data-object/data-object.module';

@Module({
  providers: [
    JwtService,
    {
      provide: 'JWT_SECRET',
      useValue: process.env.JWT_SECRET,
    },
  ],
  controllers: [LoginController, RegisterController],
  imports: [DataObjectModule],
})
export class AuthModule {}
