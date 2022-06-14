import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SeasonService } from '../../data-object/season/season.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RequiredRoles } from '../../auth/role.decorator';
import { RoleGuard } from '../../auth/role.guard';
import { UserRoles } from '../../auth/types';
import { PostSeasonInput } from './dto';

@Controller('season')
@UseGuards(AuthGuard)
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Post()
  @RequiredRoles(UserRoles.Admin)
  @UseGuards(RoleGuard)
  async createSeason(@Body() body: PostSeasonInput) {
    return this.seasonService.createSeason(body.year);
  }
}
