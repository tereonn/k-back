import { Injectable } from '@nestjs/common';
import { UserDao } from '../data/user';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser } from '@prisma/client';
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
}
