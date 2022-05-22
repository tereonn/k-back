import { IsAlpha, IsString, MinLength } from 'class-validator';

export class PostTeamInput {
  @IsString()
  @MinLength(1)
  name: string;
}

export class GetTeamInput {
  @IsString()
  @MinLength(1)
  @IsAlpha()
  name: string;
}
