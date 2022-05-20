import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Team, User } from '@prisma/client';

@Injectable()
export class RaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamByName(name: string): Promise<Team & { User: User[] }> {
    return this.prisma.team.findFirst({
      where: {
        name,
      },
      include: {
        User: true,
      },
    });
  }

  async createTeam(
    name: string,
    creatorId: number,
  ): Promise<Team & { User: User[] }> {
    return this.prisma.team.create({
      data: {
        name,
        User: {
          connect: [{ id: creatorId }],
        },
      },
      include: {
        User: true,
      },
    });
  }
}
