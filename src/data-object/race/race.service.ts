import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TeamDao } from '../data/team';

@Injectable()
export class RaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamByName(name: string): Promise<TeamDao | null> {
    const teamData = await this.prisma.team.findFirst({
      where: {
        name,
      },
      include: {
        TeamOnUser: {
          select: {
            owner: true,
            member: {
              include: {
                UserInfo: true,
              },
            },
          },
        },
      },
    });

    if (!teamData) {
      return null;
    }

    return TeamDao.fromPrismaResp(teamData);
  }

  async createTeam(name: string, creatorId: number): Promise<TeamDao> {
    const teamData = await this.prisma.team.create({
      data: {
        name,
        TeamOnUser: {
          create: [
            {
              member: {
                connect: {
                  id: creatorId,
                },
              },
              owner: true,
            },
          ],
        },
      },
      include: {
        TeamOnUser: {
          select: {
            owner: true,
            member: {
              include: {
                UserInfo: true,
              },
            },
          },
        },
      },
    });

    return TeamDao.fromPrismaResp(teamData);
  }
}
