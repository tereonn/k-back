import { Injectable } from '@nestjs/common';
import { RaceService } from '../../data-object/race/race.service';
import { UserService } from '../../data-object/user/user.service';

@Injectable()
export class UserRaceService {
  constructor(
    private readonly raceService: RaceService,
    private readonly userService: UserService,
  ) {}
}
