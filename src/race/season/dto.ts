import { IsNumber, Max, Min } from 'class-validator';

export class PostSeasonInput {
  @IsNumber()
  @Min(2000)
  @Max(2050)
  year: number;
}
