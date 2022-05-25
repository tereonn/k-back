import { Injectable } from '@nestjs/common';
import { UserDao } from '../data/user';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser, Team } from '@prisma/client';
import { userPropsToUpdInput } from '../helpers';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  save(u: UserDao): Promise<PrismaUser> {
    return this.prisma.user.create({
      data: {
        login: u.login,
        pass: u.passHash,
        UserInfo: {
          create: {
            name: u.name,
            city: u.city,
            phone: u.phone,
          },
        },
      },
    });
  }

  updateUserBio(u: UserDao): Promise<PrismaUser> {
    const updatedProps = userPropsToUpdInput(u.getUpdatedProps());

    return this.prisma.user.update({
      data: { ...updatedProps },
      where: {
        id: u.id,
      },
    });
  }

  findByLogin(login: string): Promise<PrismaUser> {
    return this.prisma.user.findFirst({
      where: {
        login,
      },
    });
  }

  async addTeam(uId: number, name: string): Promise<PrismaUser> {
    let team = await this.prisma.team.findFirst({
      where: {
        name,
      },
    });

    if (!team) {
      team = await this.prisma.team.create({
        data: {
          name,
        },
      });
    }

    return this.prisma.user.update({
      where: {
        id: uId,
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
  }
}
