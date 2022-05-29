import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
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

export class DeleteCarQuery {
  @Type(() => Number)
  @IsPositive()
  id: number;
}
