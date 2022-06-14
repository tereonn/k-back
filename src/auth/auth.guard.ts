import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { Request } from 'express';
import { CustomException } from '../errors/customException';
import { BadAuthSchema, BadJwt } from '../errors/error_codes';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context
      .switchToHttp()
      .getRequest<Request>()
      .header('Authorization');

    if (!token || token.length === 0) {
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        BadJwt.code,
        BadJwt.text,
      );
    }
    const [schema, jwt] = token.split(' ');

    if (schema !== 'Bearer') {
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        BadAuthSchema.code,
        BadAuthSchema.text,
      );
    }

    try {
      await this.jwtService.verify(jwt, {});

      return true;
    } catch (e) {
      throw new CustomException(
        HttpStatus.UNAUTHORIZED,
        BadJwt.code,
        BadJwt.text,
      );
    }
  }
}
