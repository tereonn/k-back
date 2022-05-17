import {
  IsAlpha,
  IsEmail,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterInput {
  @IsEmail()
  login: string;

  @IsString()
  @MinLength(5)
  pass: string;

  @IsAlpha()
  name: string;

  @IsNumberString()
  phone: string;

  @IsAlpha()
  city: string;
}

export class RegisterOutput {
  token: string;
}
