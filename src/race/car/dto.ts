import { PartialType } from '@nestjs/mapped-types';
import { IsAlpha, IsNotEmpty, IsPositive, IsString } from 'class-validator';

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
class PartialCarInput extends PartialType(PostCarInput) {}

export class PutCarInput {
  @IsPositive()
  id: number;

  data: PartialCarInput;
}
