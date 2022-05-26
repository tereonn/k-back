import { UserDao } from './user';
import { Team, User, UserInfo } from '@prisma/client';
import { TeamData } from 'src/race/team/dto';

export class TeamDao {
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

  get members(): UserDao[] {
    return this._members;
  }
  set members(_: UserDao[]) {}

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
}
