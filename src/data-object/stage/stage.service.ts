import { Injectable } from '@nestjs/common';
import { Stage } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { StageCreateData } from './types';

@Injectable()
export class StageService {
  constructor(private readonly prisma: PrismaService) {}

  createStage(data: StageCreateData): Promise<Stage> {
    return this.prisma.stage.create({
      data: {
        date: data.date,
        place: data.place,
        Season: {
          connect: {
            id: data.seasonId,
          },
        },
      },
    });
  }
}
