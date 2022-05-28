import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

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

export class TeamInfoOutput {
  success: boolean;
  data: TeamData | null;
}

export class TeamData {
  name: string;
  owner: {
    name: string;
    id: number;
  };
  members: {
    name: string;
    id: number;
  }[];
}

export class PutTeamInput {
  @IsString()
  @MinLength(1)
  oldName: string;

  @IsString()
  @MinLength(1)
  newName: string;
}

export class PutJoinTeamInput {
  @IsString()
  @MinLength(1)
  name: string;
}

export class PutRemoveTeamInput {
  @IsString()
  @MinLength(1)
  teamName: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId: number;
}
