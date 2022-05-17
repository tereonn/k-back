import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomException } from './customException';
import { Response } from 'express';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost): any {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.httpCode)
      .json({
        code: exception.inAppCode,
        msg: exception.errMsg,
      });
  }
}
