import { IsString, MinLength } from 'class-validator';

export class PostTeamInput {
  @IsString()
  @MinLength(1)
  name: string;
}
