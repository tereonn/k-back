import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Season, Stage } from '@prisma/client';

@Injectable()
export class SeasonService {
  constructor(private readonly prisma: PrismaService) {}

  async getSeasonList(
    pagination: number,
    numbersInList: number,
  ): Promise<Season[]> {
    return this.prisma.season.findMany({
      skip: pagination,
      take: numbersInList,
      orderBy: [
        {
          year: 'desc',
        },
      ],
    });
  }

  async getSeasonById(id: number): Promise<Season & { stages: Stage[] }> {
    return this.prisma.season.findUnique({
      where: {
        id,
      },
      include: {
        stages: true,
      },
    });
  }

  async createSeason(year: number): Promise<Season> {
    return this.prisma.season.create({
      data: {
        year,
      },
    });
  }

  async changeSeasonYear(
    id: number,
    year: number,
  ): Promise<Season & { stages: Stage[] }> {
    return this.prisma.season.update({
      where: {
        id,
      },
      data: {
        year,
      },
      include: {
        stages: true,
      },
    });
  }
}
