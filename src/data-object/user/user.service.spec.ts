import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import exp from 'constants';

describe('UserService', () => {
  const mockUserData = {
    id: 0,
    login: 'test@tt.tt',
    pass: '1234567',
    phone: '111111111',
    city: 'tcity',
    name: 'name',
  };

  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
