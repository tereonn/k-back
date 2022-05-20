import { HttpStatus, Injectable } from '@nestjs/common';
import { RaceService } from '../../data-object/race/race.service';
import { User } from '@prisma/client';
import { CustomException } from '../../errors/customException';
import { TooManyUsersInTeam } from '../../errors/error_codes';
import { UserService } from '../../data-object/user/user.service';

@Injectable()
export class UserRaceService {
  constructor(
    private readonly raceService: RaceService,
    private readonly userService: UserService,
  ) {}

  async addUserToTeam(uId: number, tName: string): Promise<User> {
    const team = await this.raceService.getTeamByName(tName);

    //todo max users in team value should move to app config and save in db or env
    if (team.User.length > 3) {
      throw new CustomException(
        HttpStatus.CONFLICT,
        TooManyUsersInTeam.code,
        TooManyUsersInTeam.text,
      );
    }

    return this.userService.addTeam(uId, tName);
  }
}
