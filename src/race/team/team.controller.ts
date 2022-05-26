import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { TokenPayload } from '../../auth/types';
import {
  GetTeamInput,
  TeamInfoOutput,
  PostTeamInput,
  PutTeamInput,
} from './dto';
import { RaceService } from '../../data-object/race/race.service';
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
  ): Promise<TeamInfoOutput> {
    const existingTeam = await this.raceService.getTeamByName(team.name);
    if (existingTeam) {
      throw new CustomException(
        HttpStatus.CONFLICT,
        TeamNameAlreadyUsed.code,
        TeamNameAlreadyUsed.text,
      );
    }

    const t = await this.raceService.createTeam(team.name, req.user.id);

    return {
      success: true,
      data: t.makeTeamInfoOutput(),
    };
  }

  @Get()
  async getTeamByName(
    @Query() { name }: GetTeamInput,
  ): Promise<TeamInfoOutput> {
    const team = await this.raceService.getTeamByName(name);
    if (!team) {
      return { success: false, data: null };
    }
    return { success: true, data: team.makeTeamInfoOutput() };
  }

  @Put()
  async addUserToTeam(
    @Req() req: TokenPayload,
    @Body() body: PutTeamInput,
  ): Promise<void> {}
}
