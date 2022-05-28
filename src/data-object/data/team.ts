import { UserDao } from './user';
import { Team, User, UserInfo, Prisma } from '@prisma/client';
import { TeamData } from 'src/race/team/dto';

export class TeamDao {
  private updObj: Partial<TeamDao> = {};
  private daoToDbProps = new Map<keyof TeamDao, string>([['name', 'name']]);
  private constructor(
    private _id: number,
    private _name: string,
    private _members: UserDao[],
    private _owner: UserDao,
  ) {}

  static fromPrismaResp(
    d: Team & {
      TeamOnUser: { owner: boolean; member: User & { UserInfo: UserInfo } }[];
    },
  ): TeamDao {
    const ownerData = d.TeamOnUser.find((m) => m.owner);
    const owner = UserDao.fromIdLoginPass(
      ownerData.member.id,
      ownerData.member.login,
      ownerData.member.pass,
    ).addName(ownerData.member.UserInfo?.name ?? '');
    const members: UserDao[] = d.TeamOnUser.filter((m) => !m.owner)
      .map((m) => m.member)
      .map((m) =>
        UserDao.fromIdLoginPass(m.id, m.login, m.pass).addName(
          m.UserInfo?.name ?? '',
        ),
      );

    return new TeamDao(d.id, d.name, members, owner);
  }
  static makeCreateQuery(name: string, ownerId: number) {
    return {
      data: {
        name,
        TeamOnUser: {
          create: {
            member: {
              connect: {
                id: ownerId,
              },
            },
            owner: true,
          },
        },
      },
    };
  }

  get members(): UserDao[] {
    return this._members;
  }
  set members(_: UserDao[]) {}

  get name(): string {
    return this._name;
  }
  set name(n: string) {
    this.updObj.name = n;
    this._name = n;
  }

  get id(): number {
    return this._id;
  }
  set id(_: number) {}

  get owner(): UserDao {
    return this._owner;
  }
  set owner(_: UserDao) {}

  makeTeamInfoOutput(): TeamData {
    return {
      name: this._name,
      owner: {
        name: this._owner.name,
        id: this._owner.id,
      },
      members: this._members.map((m) => ({ name: m.name, id: m.id })),
    };
  }

  makeUpdByIdQuery(): Prisma.TeamUpdateArgs {
    const updData: Prisma.TeamUpdateInput = {};

    for (const [daoProp, dbProp] of this.daoToDbProps) {
      if (this.updObj.hasOwnProperty(daoProp)) {
        updData[dbProp] = this.updObj[daoProp];
      }
    }

    if (Object.keys(updData).length === 0) {
      return null;
    }

    return {
      where: {
        id: this._id,
      },
      data: updData,
    };
  }

  makeRemoveUserQuery(id: number): Prisma.TeamUpdateArgs {
    return {
      where: {
        id: this._id,
      },
      data: {
        TeamOnUser: {
          deleteMany: {
            userId: id,
            teamId: this._id,
          },
        },
      },
    };
  }
}
