import { Injectable } from '@nestjs/common';
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
  sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options: SignOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, secretOrPrivateKey, options, (err, token) =>
        err ? reject(err) : resolve(token),
      );
    });
  }

  verify(
    token: string,
    secretOrPrivateKey: Secret | GetPublicKeyOrSecret,
    options: VerifyOptions,
  ): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        secretOrPrivateKey,
        { ...options, complete: false },
        (err, decoded) => (err ? reject(err) : resolve(decoded)),
      );
    });
  }
}
