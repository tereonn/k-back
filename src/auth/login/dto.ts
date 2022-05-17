import { IsEmail, IsString, MinLength } from 'class-validator';

export class GetLoginInput {
  @IsEmail()
  login: string;

  @IsString()
  @MinLength(5)
  pass: string;
}

export class GetLoginOutpout {
  token: string;
}
