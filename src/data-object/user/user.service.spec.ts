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

  it('Should create team if it isnt created yet and return updated user object', async () => {
    const newTeam = { name: 'testTeam', id: 0 };

    prisma.team.create = jest.fn().mockReturnValue(Promise.resolve(newTeam));
    prisma.team.findFirst = jest.fn().mockReturnValue(Promise.resolve(null));
    prisma.user.update = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ ...mockUserData, team: { ...newTeam } }),
      );

    const res = await service.addTeam(mockUserData.id, newTeam.name);

    expect(prisma.team.create).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUserData.id },
      data: {
        team: {
          connect: {
            id: newTeam.id,
          },
        },
      },
      include: {
        team: true,
      },
    });
    expect(res).toMatchObject({ ...mockUserData, team: { ...newTeam } });
  });

  it('Should update user team if it already exists', async () => {
    const team = { name: 'exteam', id: 10 };

    prisma.team.findFirst = jest.fn().mockReturnValue(Promise.resolve(team));
    prisma.team.create = jest.fn();
    prisma.user.update = jest.fn().mockReturnValue(
      Promise.resolve({
        ...mockUserData,
        team: { ...team },
      }),
    );

    const res = await service.addTeam(mockUserData.id, team.name);

    expect(prisma.team.create).not.toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: mockUserData.id,
      },
      data: {
        team: {
          connect: {
            id: team.id,
          },
        },
      },
      include: {
        team: true,
      },
    });
    expect(res).toMatchObject({
      ...mockUserData,
      team: { ...team },
    });
  });
});
