import { Inject, Injectable } from '@nestjs/common';
import {
  GetPublicKeyOrSecret,
  JwtPayload,
  Secret,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';

// wrapper for the jsonwebtoken library
@Injectable()
export class JwtService {
  constructor(@Inject('JWT_SECRET') private secret: string) {}

  sign(
    payload: string | Buffer | object,
    options: SignOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, this.secret, options, (err, token) =>
        err ? reject(err) : resolve(token),
      );
    });
  }

  verify(token: string, options: VerifyOptions): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        this.secret,
        { ...options, complete: false },
        (err, decoded) => (err ? reject(err) : resolve(decoded)),
      );
    });
  }
}
