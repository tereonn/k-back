import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TeamDao } from '../data/team';

@Injectable()
export class RaceService {
  private readonly teamDataIncludeQuery = {
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
  };
  constructor(private readonly prisma: PrismaService) {}

  async getTeamByName(name: string): Promise<TeamDao | null> {
    const teamData = await this.prisma.team.findFirst({
      where: {
        name,
      },
      ...this.teamDataIncludeQuery,
    });

    if (!teamData) {
      return null;
    }

    return TeamDao.fromPrismaResp(teamData);
  }

  async createTeam(name: string, creatorId: number): Promise<TeamDao> {
    const teamData = await this.prisma.team.create({
      ...TeamDao.makeCreateQuery(name, creatorId),
      ...this.teamDataIncludeQuery,
    });

    return TeamDao.fromPrismaResp(teamData);
  }

  async updateTeam(t: TeamDao): Promise<TeamDao> {
    const q = t.makeUpdByIdQuery();
    const res = await this.prisma.team.update({
      ...q,
      ...this.teamDataIncludeQuery,
    });

    return TeamDao.fromPrismaResp(res);
  }

  async addTeamMember(uId: number, t: TeamDao): Promise<TeamDao> {
    const res = await this.prisma.team.update({
      where: {
        name: t.name,
      },
      data: {
        TeamOnUser: {
          create: {
            member: {
              connect: {
                id: uId,
              },
            },
            owner: false,
          },
        },
      },
      ...this.teamDataIncludeQuery,
    });

    return TeamDao.fromPrismaResp(res);
  }
}
