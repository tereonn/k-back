import { Get, Body, Controller, Post, UseGuards, Query } from '@nestjs/common';
import { SeasonService } from '../../data-object/season/season.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RequiredRoles } from '../../auth/role.decorator';
import { RoleGuard } from '../../auth/role.guard';
import { UserRoles } from '../../auth/types';
import { PostSeasonInput } from './dto';

@Controller('season')
@UseGuards(AuthGuard)
export class SeasonController {
  private readonly ITEMS_IN_GET_SEASON = 10;
  constructor(private readonly seasonService: SeasonService) {}

  @Post()
  @RequiredRoles(UserRoles.Admin)
  @UseGuards(RoleGuard)
  async createSeason(@Body() body: PostSeasonInput) {
    return this.seasonService.createSeason(body.year);
  }

  @Get()
  async getSeason(@Query('page') page: number) {
    return this.seasonService.getSeasonList(page, this.ITEMS_IN_GET_SEASON);
  }
}
