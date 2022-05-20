import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from './jwt/jwt.service';
import { TokenPayload } from './types';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request & TokenPayload, res: Response, next: () => void) {
    const jwt = req.header('Authorization').split(' ')[1];

    req.user = this.jwtService.decode(jwt);
    next();
  }
}
