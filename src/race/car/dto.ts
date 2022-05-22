import { Transform } from 'class-transformer';
import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class PostCarInput {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  color: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  model: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}
