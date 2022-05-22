import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { TokenPayload } from '../../auth/types';
import { GetTeamInput, PostTeamInput } from './dto';
import { RaceService } from '../../data-object/race/race.service';
import { Team, User } from '@prisma/client';
import { CustomException } from '../../errors/customException';
import { TeamNameAlreadyUsed } from '../../errors/error_codes';

@Controller('team')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly raceService: RaceService) {}

  @Post()
  async addTeam(
    @Req() req: TokenPayload,
    @Body('team') team: PostTeamInput,
  ): Promise<Team & { User: User[] }> {
    const existingTeam = await this.raceService.getTeamByName(team.name);
    if (existingTeam) {
      throw new CustomException(
        HttpStatus.CONFLICT,
        TeamNameAlreadyUsed.code,
        TeamNameAlreadyUsed.text,
      );
    }

    return this.raceService.createTeam(team.name, req.user.id);
  }

  @Get()
  async getTeamByName(@Query() { name }: GetTeamInput) {
    return this.raceService.getTeamByName(name);
  }
}
