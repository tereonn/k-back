import { Injectable } from '@nestjs/common';
import { User } from '../data/user';
import { PrismaService } from '../prisma.service';
import { User as PrismaUser } from '@prisma/client';
import { userPropsToUpdInput } from '../helpers';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  save(u: User): Promise<PrismaUser> {
    return this.prisma.user.create({
      data: {
        login: u.login,
        pass: u.passHash,
      },
    });
  }

  updateUserBio(u: User): Promise<PrismaUser> {
    const updatedProps = userPropsToUpdInput(u.getUpdatedProps());

    return this.prisma.user.update({
      data: { ...updatedProps },
      where: {
        id: u.id,
      },
    });
  }
}
