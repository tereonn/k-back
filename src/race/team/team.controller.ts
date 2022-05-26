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
  PutJoinTeamInput,
} from './dto';
import { RaceService } from '../../data-object/race/race.service';
import { CustomException } from '../../errors/customException';
import {
  CantAddUser,
  NotPermitted,
  TeamNameAlreadyUsed,
  UpdObjectNotFound,
} from '../../errors/error_codes';

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
  async changeTeamData(
    @Req() req: TokenPayload,
    @Body() body: PutTeamInput,
  ): Promise<TeamInfoOutput> {
    const team = await this.raceService.getTeamByName(body.oldName);
    if (!team) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        UpdObjectNotFound.code,
        UpdObjectNotFound.text,
      );
    }

    if (team.owner.id !== req.user.id) {
      throw new CustomException(
        HttpStatus.FORBIDDEN,
        NotPermitted.code,
        NotPermitted.text,
      );
    }

    team.name = body.newName;

    return {
      success: true,
      data: (await this.raceService.updateTeam(team)).makeTeamInfoOutput(),
    };
  }

  @Put('/join')
  async addUserToTeam(
    @Req() req: TokenPayload,
    @Query() q: PutJoinTeamInput,
  ): Promise<TeamInfoOutput> {
    const team = await this.raceService.getTeamByName(q.name);

    if (!team) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        UpdObjectNotFound.code,
        UpdObjectNotFound.text,
      );
    }

    if (
      team.owner.id === req.user.id ||
      team.members.some((m) => m.id === req.user.id)
    ) {
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        CantAddUser.code,
        CantAddUser.text,
      );
    }

    return {
      success: true,
      data: (
        await this.raceService.addTeamMember(req.user.id, team)
      ).makeTeamInfoOutput(),
    };
  }
}
