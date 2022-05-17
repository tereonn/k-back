import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { GetLoginInput, GetLoginOutpout } from './dto';
import { UserService } from '../../data-object/user/user.service';
import { CustomException } from '../../errors/customException';
import { BadLoginOrPass } from '../../errors/error_codes';
import { JwtService } from '../jwt/jwt.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async login(@Query() q: GetLoginInput): Promise<GetLoginOutpout> {
    const user = await this.userService.findByLogin(q.login);

    // Todo hash password and add some safety
    if (!user || q.pass !== user.pass) {
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        BadLoginOrPass.code,
        BadLoginOrPass.text,
      );
    }

    const token = await this.jwtService.sign(
      {
        id: user.id,
      },
      {
        //Todo as register
        expiresIn: '1h',
      },
    );

    return {
      token,
    };
  }
}
