import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../../data-object/user/user.service';
import { UserDao } from '../../data-object/data/user';
import { RegisterInput, RegisterOutput } from './dto';
import { CustomException } from '../../errors/customException';
import { UserExists } from '../../errors/error_codes';
import { JwtService } from '../jwt/jwt.service';
import { UserRoles } from '../types';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtServicw: JwtService,
  ) {}

  @Post()
  async register(@Body('user') u: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userService.findByLogin(u.login);

    if (existingUser) {
      throw new CustomException(
        HttpStatus.CONFLICT,
        UserExists.code,
        UserExists.text,
      );
    }

    const newUser = UserDao.fromLoginPass(u.login, u.pass)
      .addName(u.name)
      .addCity(u.city)
      .addPhone(u.phone)
      .addRoles([UserRoles.User]);

    const saved = await this.userService.save(newUser);
    const token = await this.jwtServicw.sign(
      {
        id: saved.id,
        roles: saved.roles.map((r) => r.code),
      },
      {
        //Todo should get exp time from config module or env variable
        expiresIn: '1h',
      },
    );

    return {
      token,
    };
  }
}
