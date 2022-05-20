import { Test, TestingModule } from '@nestjs/testing';
import { UserRaceService } from './user-race.service';

describe('UserRaceService', () => {
  let service: UserRaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRaceService],
    }).compile();

    service = module.get<UserRaceService>(UserRaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
