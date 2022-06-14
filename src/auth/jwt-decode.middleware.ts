import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from './jwt/jwt.service';
import { TokenPayload } from './types';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request & TokenPayload, _: Response, next: () => void) {
    const token = req.header('Authorization');

    if (!token || token.split(' ').length === 1) {
      return next();
    }
    const jwt = token.split(' ')[1];

    req.user = this.jwtService.decode(jwt);
    next();
  }
}
