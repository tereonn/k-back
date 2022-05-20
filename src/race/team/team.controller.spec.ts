import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { RaceService } from '../../data-object/race/race.service';

describe('TeamController', () => {
  let controller: TeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [RaceService],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should save user team and return updated user object', async () => {});
});
