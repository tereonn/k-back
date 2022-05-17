import { HttpStatus } from '@nestjs/common';

export class CustomException {
  constructor(
    public httpCode: HttpStatus,
    public inAppCode: number,
    public errMsg: string,
  ) {}
}
