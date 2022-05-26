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
  name: string;
}
